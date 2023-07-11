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
        size={13}
        position={[25, 20]}
        direction={1}
        velocity={8}
        distance={30}
      />
      <AnimatedCircle
        size={9}
        position={[26, 65]}
        direction={-1}
        velocity={5}
        distance={30}
      />
      <AnimatedCircle
        size={6}
        position={[22, 65]}
        direction={-1}
        velocity={3}
        distance={50}
      />
      <AnimatedCircle
        size={4}
        position={[40, 65]}
        direction={-1}
        velocity={3.5}
        distance={30}
      />
      <AnimatedCircle
        size={5}
        position={[55, 65]}
        direction={-1}
        velocity={3.5}
        distance={30}
      />
    </div>
  );
});
