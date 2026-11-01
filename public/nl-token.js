// Desktop app: Neutralino hands out its access token only once, so keep it for page reloads.
if (window.NL_TOKEN) sessionStorage.setItem("NL_TOKEN", window.NL_TOKEN);
