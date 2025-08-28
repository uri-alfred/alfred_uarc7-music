/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getYouTubeVideosWithStats(maxResults: number = 10, tipoVideo: string = 'default') {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    console.error("Faltan credenciales de YouTube");
    return [];
  }

  try {
    // Paso 1: Obtener lista de videos
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

    if (tipoVideo === 'popular') {
      searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=${maxResults}&type=video`;
    }

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items) return [];

    // Paso 2: Obtener estadísticas de cada video
    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .join(",");
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;

    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    return statsData.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id,
      views: parseInt(item.statistics.viewCount) || 0,
      likes: parseInt(item.statistics.likeCount) || 0,
      duration: formatDuration(item.contentDetails.duration),
      publishedAt: item.snippet.publishedAt,
      cover:
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.default.url,
      plays: formatPlays(parseInt(item.statistics.viewCount) || 0),
    }));
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return [];
  }
}

function formatPlays(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

function formatDuration(duration: string): string {
  // Convierte ISO 8601 duration a formato legible
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return duration;
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  return `${hours ? hours + ':' : ''}${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}
