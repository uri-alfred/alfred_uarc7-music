// /scripts/fetch-youtube-cache.js
// Script para obtener los 8 videos más vistos y los 4 últimos subidos y guardarlos en un JSON estático

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = 'AIzaSyDKSRgso3IHl0Z1hfItcttG4sSgN48eAIM';
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

// console.log(API_KEY, CHANNEL_ID);

if (!API_KEY || !CHANNEL_ID) {
  console.error('Faltan credenciales de YouTube');
  process.exit(1);
}

async function fetchVideos(order, maxResults) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=${order}&maxResults=${maxResults}&type=video`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();
  if (!searchData.items) return [];
  const videoIds = searchData.items.map(item => item.id.videoId).join(',');
  if (!videoIds) return [];
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;
  const statsResponse = await fetch(statsUrl);
  const statsData = await statsResponse.json();
  return statsData.items.map(item => ({
    title: item.snippet.title,
    videoId: item.id,
    views: parseInt(item.statistics.viewCount) || 0,
    likes: parseInt(item.statistics.likeCount) || 0,
    duration: item.contentDetails.duration,
    publishedAt: item.snippet.publishedAt,
    cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
  }));
}

(async () => {
  try {
    const latest = await fetchVideos('date', 4);
    const popular = await fetchVideos('viewCount', 8);
    const data = { latest, popular };
    const outPath = path.join(__dirname, '../public/youtube-cache.json');
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log('YouTube cache actualizado:', outPath);
  } catch (err) {
    console.error('Error al obtener videos de YouTube:', err);
    process.exit(1);
  }
})();
