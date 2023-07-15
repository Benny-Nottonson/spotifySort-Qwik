import { component$ } from "@builder.io/qwik";
import Background from "~/components/background/background";

export default component$(() => {
  return (
    <div>
      <Background />
      <div style="margin: auto; text-align: center; width: 50%; height: 50%; color:white;">
        <h1>404</h1>
        <h2>Page not found</h2>
      </div>
    </div>
  );
});
