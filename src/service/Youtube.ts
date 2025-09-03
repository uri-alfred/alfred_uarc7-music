/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getYouTubeVideosWithStats(maxResults: number = 10, tipoVideo: string = 'default') {
  try {
    const res = await fetch('/youtube-cache.json');
    const data = await res.json();
    let videos: any[] = [];
    if (tipoVideo === 'popular') {
      videos = data.popular || [];
    } else {
      videos = data.latest || [];
    }
    // Si se pide menos videos de los que hay, recorta
    return videos.slice(0, maxResults).map((item: any) => ({
      title: item.title,
      videoId: item.videoId,
      views: item.views,
      likes: item.likes,
      duration: formatDuration(item.duration),
      publishedAt: item.publishedAt,
      cover: item.cover,
      plays: formatPlays(item.views),
    }));
  } catch (error) {
    console.error('Error leyendo el cache de YouTube:', error);
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
