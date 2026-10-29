import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles.css";
import { AppShell } from "@/components/app-shell";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
);

if ("serviceWorker" in navigator && location.protocol.startsWith("http") && location.hostname !== "127.0.0.1") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
