export default async function getPlaylist(token: string, id: string) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const tracks = data.tracks.items.map((track: any) => {
    return {
      id: track.track.id,
      imageUrl: track.track.album.images[0].url,
    };
  });
  return tracks;
}
