// Montserrat (OFL) served from public/fonts so renders work offline and in sandboxed cloud sessions
// (no request to Google Fonts at render time). Latin subset = covers á é í ó ú ñ ¿ ¡.
import { continueRender, delayRender, staticFile } from "remotion";

export const fontFamily = "Montserrat";

if (typeof document !== "undefined" && !(globalThis as any).__montserratLoaded) {
  (globalThis as any).__montserratLoaded = true;
  const handle = delayRender("Loading Montserrat");
  const face = new FontFace(fontFamily, `url(${staticFile("fonts/montserrat-latin.woff2")}) format("woff2")`, { weight: "100 900", style: "normal" });
  face.load()
    .then((f) => { document.fonts.add(f); continueRender(handle); })
    .catch((e) => { console.error("Montserrat failed to load", e); continueRender(handle); });
}
