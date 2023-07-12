import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import Playlist from "~/components/playlist/playlist";

interface CarouselProps {
  token: string;
}

export default component$(({ token }: CarouselProps) => {
  const playlists = useSignal<string[]>([]);

  useVisibleTask$(() => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        playlists.value = data.items.map((item: any) => item.id);
      })
      .catch((error) => {
        console.error("An error occurred during profile retrieval:", error);
      });
  });

  return (
    <>
      {playlists.value.map((playlistId: string) => (
        <Playlist key={playlistId} token={token} id={playlistId}></Playlist>
      ))}
    </>
  );
});
