export default function sendPlaylist(token: string, playlistId: string, tracks: string[]) {
    // Split the tracks into groups of 100
    const trackGroups = [];
    while (tracks.length > 0) {
        trackGroups.push(tracks.splice(0, 100));
    }
    // Wipe the playlist with removePlaylistItems
    trackGroups.map(async (trackGroup) => {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tracks: trackGroup.map((track) => {
                    return { uri: `spotify:track:${track}` };
                }),
            }),
        });
        return response;
    });

    // Add the tracks back in
    trackGroups.map(async (trackGroup) => {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uris: trackGroup.map((track) => {
                    return `spotify:track:${track}`;
                }),
            }),
        });
        return response;
    });
}