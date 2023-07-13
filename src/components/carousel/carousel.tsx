import {
  component$,
  useVisibleTask$,
  useSignal,
  useStylesScoped$,
  $,
} from "@builder.io/qwik";
import Playlist from "~/components/playlist/playlist";
import css from "./carousel.css?inline";

interface CarouselProps {
  token: string;
}

export default component$(({ token }: CarouselProps) => {
  useStylesScoped$(css);
  const playlists = useSignal<string[]>([]);
  const currentIndex = useSignal<number>(1);

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

  const prevItem = $(() => {
    currentIndex.value =
      (currentIndex.value - 1 + playlists.value.length) %
      playlists.value.length;
  });

  const nextItem = $(() => {
    currentIndex.value = (currentIndex.value + 1) % playlists.value.length;
  });

  return (
    <div class="carousel">
      <div class="carousel-arrow left" onClick$={prevItem}>{`➤`}</div>
      {playlists.value.map((playlistId: string, index: number) => (
        <div
          key={playlistId}
          class={`carousel-item ${
            index === currentIndex.value
              ? "center"
              : index ===
                (currentIndex.value - 1 + playlists.value.length) %
                  playlists.value.length
              ? "left"
              : index === (currentIndex.value + 1) % playlists.value.length
              ? "right"
              : "far"
          }`}
        >
          <Playlist token={token} id={playlistId} />
        </div>
      ))}
      <div class="carousel-arrow right" onClick$={nextItem}>{`➤`}</div>
    </div>
  );
});
