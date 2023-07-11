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
        position={[25, 15]}
        direction={1}
        velocity={8}
        distance={30}
      />
      <AnimatedCircle
        size={5}
        position={[60, 20]}
        direction={1}
        velocity={8.2}
        distance={30}
      />
      <AnimatedCircle
        size={11}
        position={[50, 20]}
        direction={-1}
        velocity={6.7}
        distance={40}
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
        position={[24, 65]}
        direction={-1}
        velocity={3}
        distance={50}
      />
      <AnimatedCircle
        size={4}
        position={[38, 65]}
        direction={-1}
        velocity={3.5}
        distance={30}
      />
      <AnimatedCircle
        size={12}
        position={[42, 65]}
        direction={-1}
        velocity={5.2}
        distance={40}
      />
      <AnimatedCircle
        size={7}
        position={[50, 63]}
        direction={-1}
        velocity={3.5}
        distance={70}
      />
      <AnimatedCircle
        size={13}
        position={[55, 45]}
        direction={1}
        velocity={8}
        distance={30}
      />
    </div>
  );
});
