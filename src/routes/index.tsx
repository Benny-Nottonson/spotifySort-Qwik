import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import NeonText from "~/components/neonText/neonText";
import Background from "~/components/background/background";
import AuthButton from "~/components/authButton/authButton";
import Carousel from "~/components/carousel/carousel";

export default component$(() => {
  const token = useSignal<string>();
  useVisibleTask$(() => {
    const refreshToken = $((): string | undefined => {
      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token) {
        fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=54da531311af407b97ebbb354dc29a85`,
        })
          .then((response) => response.json())
          .then((data) => {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            return data.access_token;
          })
          .catch((error) => {
            console.error("An error occurred during token refresh:", error);
            return undefined;
          });
      }
      return undefined;
    });

    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (response) => {
          if (response.ok) {
            token.value = accessToken;
          } else {
            token.value = await refreshToken();
          }
        })
        .catch((error) => {
          console.error("An error occurred during profile retrieval:", error);
        });
    }
  });
  return (
    <>
      <Background />
      <NeonText text="Spotify Sort" size={5} />
      <div class="buttonClass authButton">
        <AuthButton />
      </div>
      {token.value && (
        <div>
          <Carousel token={token.value} />
        </div>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Spotify Sort",
  meta: [
    {
      name: "description",
      content: "A Spotify playlist sorting tool",
    },
  ],
};
