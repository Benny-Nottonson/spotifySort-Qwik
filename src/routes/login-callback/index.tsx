import { component$, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  useVisibleTask$(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    window.opener.postMessage({ authorizationCode }, "*");
    window.close();
  });
  return null;
});
