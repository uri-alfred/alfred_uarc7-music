/* eslint-disable @typescript-eslint/no-explicit-any */
// services/spotify.ts
let accessToken: string | null = null;
let tokenExpiration: number = 0;

async function getSpotifyToken() {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  try {
    const response = await fetch('https://open.spotify.com/get_access_token');
    const data = await response.json();
    
    accessToken = data.accessToken;
    tokenExpiration = Date.now() + (data.accessTokenExpirationTimestampMs - Date.now());
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
}

export async function getArtistTopTracks(artistId: string) {
  const token = await getSpotifyToken();
  if (!token) return [];

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    
    return data.tracks.map((track: any) => ({
      title: track.name,
      plays: track.popularity, // Spotify no da plays exactos, usa popularidad
      cover: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify
    }));
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return [];
  }
}