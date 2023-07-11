import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import NeonText from "~/components/neonText/neonText";
import Background from "~/components/background/background";

export default component$(() => {
  return (
    <>
      <Background />
      <NeonText text="Spotify Sort" size={5} />
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
