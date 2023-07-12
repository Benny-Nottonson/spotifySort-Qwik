import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import CardBackground from "../cardBackground/cardBackground";
import { useStylesScoped$ } from "@builder.io/qwik";
import css from "./playlist.css?inline";

interface PlaylistProps {
  token: string;
  id: string;
}

export default component$(({ token, id }: PlaylistProps) => {
  useStylesScoped$(css);
  const maxCharacters = 25;
  const isMobile = useSignal<boolean>();
  const playlistTitle = useSignal<string>();
  const playlistImageUrl = useSignal<string>();
  const playlistLength = useSignal<number>();
  const firstThreeTracks = useSignal<string[]>();
  const isSorting = useSignal<boolean>(false);

  const handleSortPlaylist = $(() => {});

  useVisibleTask$(() => {
    isMobile.value = window.innerWidth < 768;
    fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        playlistTitle.value = data.name;
        playlistImageUrl.value = data.images[0].url;
        playlistLength.value = data.tracks.total;
        if (!isMobile.value) {
          firstThreeTracks.value = data.tracks.items
            .slice(0, 3)
            .map((item: any) => item.track.name);
        }
      })
      .catch((error) => {
        console.error("An error occurred during profile retrieval:", error);
      });
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength - 3)}...`;
  };

  return (
    <div class="cardOuterContainer">
      <div class="cardContainer">
        <div class="imageContainer">
          <img
            src={playlistImageUrl.value}
            alt={playlistTitle.value + " preview image"}
            width={48}
            height={48}
          />
        </div>
        <div class="textContainer">
          <p class="songCount"> {playlistLength.value} songs </p>
          <p class="playlistTitle"> {playlistTitle.value} </p>
        </div>
        <div class="sortButtonContainer">
          <button
            class={`sortButton ${isSorting.value ? "disabled" : ""}`}
            onClick$={handleSortPlaylist}
            disabled={isSorting.value}
          >
            Sort
          </button>
        </div>
      </div>
    </div>
  );
});
