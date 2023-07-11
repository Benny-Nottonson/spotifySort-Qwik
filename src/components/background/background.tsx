import {
  component$,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
import css from "./background.css?inline";
import AnimatedCircle from "../animatedCircle/animatedCircle";

export default component$<{}>(() => {
  useStylesScoped$(css);

  useVisibleTask$(() => {});

  return (
    <div>
      <AnimatedCircle
        size={60}
        position={[30, 0]}
        direction={1}
        velocity={5}
        distance={100}
      />
    </div>
  );
});
