import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const isLogged = useSignal<string>();

  const login = $(async () => {
    const generateRandomString = (length: number) => {
      let text = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    const generateCodeChallenge = async (codeVerifier: string) => {
      function base64encode(string: ArrayBuffer) {
        return btoa(
          String.fromCharCode.apply(null, [...new Uint8Array(string)]),
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);

      return base64encode(digest);
    };

    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const baseUrl = window.location.href;

    const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${"54da531311af407b97ebbb354dc29a85"}&response_type=code&redirect_uri=${encodeURIComponent(
      baseUrl + "/login-callback",
    )}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    localStorage.setItem("code_verifier", codeVerifier);

    const loginWindow = window.open(
      authorizationUrl,
      "_blank",
      "width=500,height=800",
    );

    const handleAuthorizationCallback = (event: MessageEvent) => {
      loginWindow!.close();

      const authorizationCode = event.data.authorizationCode;

      const exchangeAuthorizationCode = async (
        code: string,
        verifier: string,
      ) => {
        try {
          const tokenUrl = "https://accounts.spotify.com/api/token";
          const baseUrl = window.location.href;
          const redirectUri = baseUrl + "/login-callback";
          const clientId = "54da531311af407b97ebbb354dc29a85";

          const requestBody = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: verifier,
          });

          const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: requestBody,
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            isLogged.value = data.access_token;
            location.reload();
          } else {
            console.error(
              "Failed to retrieve token from Spotify.",
              await response.json(),
            );
          }
        } catch (error) {
          console.error("An error occurred during token exchange:", error);
        }
      };

      const storedCodeVerifier = localStorage.getItem("code_verifier");
      if (storedCodeVerifier) {
        exchangeAuthorizationCode(authorizationCode, storedCodeVerifier);
      } else {
        console.error("Code verifier not found in local storage.");
      }
    };

    window.addEventListener("message", handleAuthorizationCallback);
  });

  useVisibleTask$(() => {
    isLogged.value = localStorage.getItem("access_token")!;
  });

  const refreshToken = $(() => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=54da531311af407b97ebbb354dc29a85`,
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
        })
        .catch((error) => {
          console.error("An error occurred during token refresh:", error);
        });
    }
  });

  const getProfile = $(async () => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error("Failed to retrieve profile from Spotify.");
        }
      } catch (error) {
        console.error("An error occurred during profile retrieval:", error);
      }
    }
  });

  return (
    <div>
      {isLogged.value ? (
        <>
          <button onClick$={getProfile}>Get profile</button>
          <button onClick$={refreshToken}>Refresh token</button>
          <p>User is logged in. Token: {isLogged.value}</p>
        </>
      ) : (
        <button onClick$={login}>Login</button>
      )}
    </div>
  );
});
