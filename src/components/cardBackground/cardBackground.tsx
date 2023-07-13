import { component$, useStylesScoped$ } from "@builder.io/qwik";
import css from "./cardBackground.css?inline";

export default component$(() => {
  useStylesScoped$(css);
  return (
    <div class="outerContainer">
      <div class="innerContainer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.dev/svgjs"
          viewBox="0 0 700 700"
          width="700"
          height="700"
          opacity="1"
        >
          <defs>
            <linearGradient
              gradientTransform="rotate(150, 0.5, 0.5)"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="ffflux-gradient"
            >
              <stop
                stop-color="rgba(30, 215, 96, 1)"
                stop-opacity="1"
                offset="0%"
              ></stop>
              <stop
                stop-color="rgba(34, 121, 202, .2)"
                stop-opacity="1"
                offset="100%"
              ></stop>
            </linearGradient>
            <filter
              id="ffflux-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.001 0.001"
                numOctaves="2"
                seed="82"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="turbulence"
              ></feTurbulence>
              <feGaussianBlur
                stdDeviation="0 0"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="turbulence"
                edgeMode="duplicate"
                result="blur"
              ></feGaussianBlur>
              <feBlend
                mode="color-dodge"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="SourceGraphic"
                in2="blur"
                result="blend"
              ></feBlend>
            </filter>
          </defs>
          <rect
            width="700"
            height="700"
            fill="url(#ffflux-gradient)"
            filter="url(#ffflux-filter)"
          ></rect>
        </svg>
      </div>
    </div>
  );
});
