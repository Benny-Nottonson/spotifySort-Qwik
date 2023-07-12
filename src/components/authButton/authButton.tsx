import {
  component$,
  useSignal,
  $,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
import css from "./authButton.css?inline";

export default component$(() => {
  useStylesScoped$(css);
  const isLogged = useSignal<string>();
  const auth = useSignal<Element>();

  const reload = $(() => {
    location.reload();
  });

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
      baseUrl + "login-callback",
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
          const redirectUri = baseUrl + "login-callback";
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
            reload();
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
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            isLogged.value = accessToken;
          } else {
            refreshToken();
          }
        })
        .catch((error) => {
          console.error("An error occurred during profile retrieval:", error);
        });
    }
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

  const logout = $(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    reload();
  });

  return (
    <div ref={auth}>
      {isLogged.value ? (
        <>
          <button class="loginButton" onClick$={logout}>
            <div class="buttonWrapper">
              <div class="buttonContent">
                <div class="buttonInner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
                  </svg>
                  <p class="buttonText">Logout</p>
                </div>
              </div>
            </div>
          </button>
        </>
      ) : (
        <button class="loginButton" onClick$={login}>
          <div class="buttonWrapper">
            <div class="buttonContent">
              <div class="buttonInner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
                </svg>
                <p class="buttonText">Login</p>
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
});
