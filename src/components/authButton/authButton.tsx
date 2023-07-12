import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const isLogged = useSignal<string>();

  const login = $(async () => {
    try {
      const generateRandomString = $(async (length: number) => {
        let result = "";
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      });

      const exchangeAuthorizationCode = $(
        async (authorizationCode: any, codeVerifier: any) => {
          try {
            const response = await fetch(
              "https://accounts.spotify.com/api/token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${encodeURIComponent(
                  "http://localhost:5173"
                )}&code_verifier=${codeVerifier}`,
              }
            );

            if (response.ok) {
              const data = await response.json();
              localStorage.setItem("access_token", data.access_token);
              localStorage.setItem("refresh_token", data.refresh_token);
              isLogged.value = data.access_token;
            } else {
              console.error("Failed to retrieve token from Spotify.");
            }
          } catch (error) {
            console.error("An error occurred during token exchange:", error);
          }
        }
      );

      const sha256 = $((message: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        return crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
        });
      });

      const base64URLEncode = $((str: string) => {
        return btoa(str)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      });

      const codeVerifier = await generateRandomString(128);
      const codeChallenge = await base64URLEncode(await sha256(codeVerifier));

      const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${
        "54da531311af407b97ebbb354dc29a85"
      }&response_type=code&redirect_uri=${encodeURIComponent(
        "http://localhost:5173"
      )}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

      const loginWindow = window.open(
        authorizationUrl,
        "_blank",
        "width=500,height=800"
      );

      const handleAuthorizationCallback = (event: MessageEvent) => {
        if (
          event.origin === window.origin &&
          event.source === loginWindow &&
          event.data.authorizationCode
        ) {
          loginWindow.close();

          const authorizationCode = event.data.authorizationCode;

          exchangeAuthorizationCode(authorizationCode, codeVerifier);
        }
      };

      window.addEventListener("message", handleAuthorizationCallback);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
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
          console.log(data);
        })
        .catch((error) => {
          console.error("An error occurred during token refresh:", error);
        });
    }
  });

  const getProfile = $(async () => {
    const accessToken = isLogged.value;

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
