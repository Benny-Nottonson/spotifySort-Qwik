import { component$, useStylesScoped$ } from "@builder.io/qwik";
import css from "./animatedCircle.css?inline";

type AnimatedCircleProps = {
  size: number;
  position: [number, number];
  direction: number;
  velocity: number;
  distance: number;
};

export default component$<AnimatedCircleProps>((props) => {
  useStylesScoped$(css);
  const size = props.size * 2;
  const x = props.position[0];
  const y = props.position[1];
  const svg = (
    <svg
      width={size + "%"}
      height={size + "%"}
      viewBox="0 0 258 258"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={`
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            --final-pos: ${props.distance * props.direction}%;
            animation: move ${props.velocity}s ease-in-out infinite;
        `}
    >
      <circle cx="129" cy="129" r="129" fill="url(#paint0_linear_1_2)" />
      <defs>
        <linearGradient
          id="paint0_linear_1_2"
          x1="59"
          y1="24"
          x2="218"
          y2="223"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#34B281" />
          <stop offset="0.2" stop-color="#33AE81" />
          <stop offset="0.5" stop-color="#329881" />
          <stop offset="0.7" stop-color="#388381" />
          <stop offset="0.9" stop-color="#447381" />
          <stop offset="1" stop-color="#437381" />
        </linearGradient>
      </defs>
    </svg>
  );

  return <div>{svg}</div>;
});
