import { component$, useStylesScoped$ } from "@builder.io/qwik";
import css from "./neonText.css?inline";

type NeonTextProps = {
  text: string;
  size: number;
};

export default component$<NeonTextProps>((props) => {
  useStylesScoped$(css);
  return (
    <div style={{ fontSize: props.size + "rem" }} class="center">
      <h1 class="neonText">{props.text}</h1>
    </div>
  );
});
