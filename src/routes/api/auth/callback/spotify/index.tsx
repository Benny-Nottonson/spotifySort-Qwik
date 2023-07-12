import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
    useVisibleTask$(() => {
        window.localStorage.setItem("spotifySortCode", window.location.search.split("=")[1]);
        window.location.href = "http://localhost:5173";
    });
  return (
    <></>
  );
});

export const head: DocumentHead = {
  title: "Spotify Sort Auth Page",
  meta: [
    {
      name: "description",
      content: "An authentication page for Spotify Sort",
    },
  ],
};
