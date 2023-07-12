import { component$, useSignal, useVisibleTask$, $, useStore } from "@builder.io/qwik";
import CardBackground from "../cardBackground/cardBackground";
import { useStylesScoped$ } from "@builder.io/qwik";
import css from "./playlist.css?inline";
import SortButton from "../sortButton";

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
  const firstThreeTracks = useStore(
    {
      trackNames: [] as string[],
      artistNames: [] as string[],
    }
  );
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
          data.tracks.items.slice(0, 3).forEach((track: any) => {
            firstThreeTracks.trackNames.push(track.track.name);
            firstThreeTracks.artistNames.push(
              track.track.artists.map((
                artist: { name: string; }
              ) => artist.name).join(", ")
            );
          });
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
    <div class="flex items-center justify-center w-auto">
        <div class="p-4 pb-3 block w-[55vh] rounded-3xl perspective-800 rotate-y-2 ease-in backdrop-blur-2xl bg-white/5 tracking-wide border border-green-400/10">
          <div class="flex">
            <>
              <div class="flex-col">
                <div class="relative h-48 w-48 mr-4 rounded-full perspective-800 rotate-y-8 transition-transform duration-300">
                    <img
                      src={playlistImageUrl.value}
                      alt="Playlist"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "fill" }}
                      width={196}
                      height={196}
                      class="rounded-md opacity-90"
                      loading="eager"
                    />
                </div>
                <div class="grid float-left">
                  <p class="text-gray-400 text-base mt-2 text-left">
                    {playlistLength.value} songs
                  </p>
                  <p class="text-gray-200 text-lg text-left">
                    {playlistTitle}
                  </p>
                </div>
              </div>
            </>
            <div class="flex flex-col justify-between">
              <div>
                <ul class="text-black/80 space-y-1 text-left">
                  {firstThreeTracks.trackNames.map((trackName, index) => (
                      <>
                        <li class="truncate text-gray-200 text-base">
                          {truncateText(trackName, maxCharacters)} -
                        </li>
                        <li class="text-gray-400 text-lg">
                          {truncateText(firstThreeTracks.artistNames[index], maxCharacters)}
                        </li>
                      </>
                    ))}
                </ul>
              </div>
              <div class="flex justify-end items-end mt-4">
                <button
                  class={`float-right ml-36 rounded-lg brightness-110 ${
                    isSorting.value ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick$={handleSortPlaylist}
                  disabled={isSorting.value}
                >
                  <SortButton />
                </button>
              </div>
            </div>
            <CardBackground />
          </div>
        </div>
      </div>
    );
});
