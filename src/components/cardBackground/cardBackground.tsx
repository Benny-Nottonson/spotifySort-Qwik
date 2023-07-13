import { component$, useStylesScoped$ } from "@builder.io/qwik";
import css from "./cardBackground.css?inline";

export default component$(() => {
  useStylesScoped$(css);
  return (
    <div class="outerContainer">
      <div class="innerContainer">
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
    </div>
  );
});
