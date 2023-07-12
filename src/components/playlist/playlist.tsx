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
  const firstThreeTracks = useSignal<string[][]>();
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
            .map((item: any) => [item.track.name, item.track.artists[0].name]);
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
    <div class="outerContainer">
      <div class="backgroundContainer">
        <div
          class="backgroundContainerInner"
          style={{ borderRadius: "1.5rem", overflow: "hidden" }}
        >
          <div style={{ opacity: 0.08 }}>
            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="2"
                  numOctaves="1"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100vw" height="100vh" filter="url(#noiseFilter)" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.2,
              overflow: "hidden",
            }}
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="radialGradient" cx="70%" cy="70%" r="100%">
                  <stop offset="0%" stopColor="#1ED760" stopOpacity="1" />
                  <stop offset="40%" stopColor="#62CAFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2279CA" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill="url(#radialGradient)"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="innerContainer">
        <div class="playlistContainer">
          <div class="playlistImageContainer">
            <img
              class="playlistImage"
              src={playlistImageUrl.value}
              alt="Playlist Image"
              height={192}
              width={192}
            />
            <div class="playlistTracksContainer">
              {firstThreeTracks.value?.map((track: string[], index: number) => (
                <div class="playlistTrack" key={index}>
                  <div class="playlistTrackName">{track[0]}</div>
                  <div class="playlistTrackArtist">{track[1]}</div>
                </div>
              ))}
            </div>
          </div>
          <div class="playlistInfoContainer">
            <div class="playlistLength">
              {playlistLength.value}{" "}
              {playlistLength.value === 1 ? " song" : " songs"}
            </div>
            <div class="playlistTitle">
              {playlistTitle.value
                ? truncateText(playlistTitle.value, maxCharacters)
                : ""}
            </div>
          </div>
          <div class="playlistSortButton">
            <button onClick$={handleSortPlaylist}>Sort</button>
          </div>
        </div>
      </div>
    </div>
  );
});
