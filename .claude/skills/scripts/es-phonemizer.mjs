import createEspeakNg from "@echogarden/espeak-ng-emscripten";

let workerPromise;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createEspeakNg().then((EspeakNg) => new EspeakNg.eSpeakNGWorker());
  }
  return workerPromise;
}

export async function phonemize(text, lang = "es") {
  const worker = await getWorker();
  worker.set_voice(lang === "es-419" ? "es-419" : "es");
  const value = String(text).replace(/\s+/g, " ").trim();
  if (!value) return [];
  const { code, ipa } = worker.synthesize_ipa(value);
  if (code !== 0 || !ipa) return [];
  return ipa.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}
