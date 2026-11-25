import {
  AutoTokenizer,
  RawAudio,
  StyleTextToSpeech2Model,
  Tensor,
  env,
} from "@huggingface/transformers";
import { phonemize as phonemizeEnglish } from "phonemizer";
import { phonemize as phonemizeSpanish } from "./es-phonemizer.mjs";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const VOICE_URL = `https://huggingface.co/${MODEL_ID}/resolve/main/voices/`;
const PUNCTUATION = /(\s*[;:,.!?¡¿—…"«»“”(){}[\]]+\s*)+/g;
const voiceCache = new Map();

function normalizeText(text) {
  return String(text)
    .replace(/[‘’]/g, "'")
    .replace(/«/g, "“")
    .replace(/»/g, "”")
    .replace(/[“”]/g, '"')
    .replace(/[—…]/g, " ")
    .replace(/[^\S \n]/g, " ")
    .replace(/  +/g, " ")
    .trim();
}

function splitText(text) {
  const chunks = [];
  let last = 0;
  for (const match of text.matchAll(PUNCTUATION)) {
    const index = match.index ?? 0;
    if (index > last) chunks.push({ punctuation: false, text: text.slice(last, index) });
    if (match[0].length > 0) chunks.push({ punctuation: true, text: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) chunks.push({ punctuation: false, text: text.slice(last) });
  return chunks;
}

function langForVoice(voice) {
  if (voice.startsWith("e")) return "es";
  if (voice.startsWith("b")) return "en-gb";
  return "en-us";
}

async function phonemesFor(text, lang) {
  if (lang === "es") return phonemizeSpanish(text, "es");
  return phonemizeEnglish(text, lang);
}

async function phonemize(text, lang) {
  const chunks = splitText(normalizeText(text));
  const parts = await Promise.all(
    chunks.map(async (chunk) => {
      if (chunk.punctuation) return chunk.text;
      const phonemes = await phonemesFor(chunk.text, lang);
      return phonemes.join(" ");
    }),
  );
  return parts.join("").trim();
}

async function loadVoice(voice) {
  if (voiceCache.has(voice)) return voiceCache.get(voice);
  const response = await fetch(`${VOICE_URL}${voice}.bin`);
  if (!response.ok) throw new Error(`No se pudo cargar la voz ${voice}: ${response.status}`);
  const bytes = await response.arrayBuffer();
  const style = new Float32Array(bytes);
  voiceCache.set(voice, style);
  return style;
}

export class KokoroTTS {
  constructor(model, tokenizer) {
    this.model = model;
    this.tokenizer = tokenizer;
  }

  static async from_pretrained(
    modelId = MODEL_ID,
    { dtype = "q8", device = "cpu", progress_callback = null } = {},
  ) {
    const [model, tokenizer] = await Promise.all([
      StyleTextToSpeech2Model.from_pretrained(modelId, { dtype, device, progress_callback }),
      AutoTokenizer.from_pretrained(modelId, { progress_callback }),
    ]);
    return new KokoroTTS(model, tokenizer);
  }

  listVoices() {
    return ["em_alex", "ef_dora", "em_santa", "am_michael", "af_heart"];
  }

  async generate(text, { voice = "em_alex", speed = 1 } = {}) {
    const lang = langForVoice(voice);
    const phonemes = await phonemize(text, lang);
    const { input_ids } = this.tokenizer(phonemes, { truncation: true });
    return this.generate_from_ids(input_ids, { voice, speed });
  }

  async generate_from_ids(input_ids, { voice = "em_alex", speed = 1 } = {}) {
    const styleLength = Math.min(Math.max(input_ids.dims.at(-1) - 2, 0), 509) * 256;
    const voiceData = await loadVoice(voice);
    const style = new Tensor("float32", voiceData.slice(styleLength, styleLength + 256), [1, 256]);
    const speedTensor = new Tensor("float32", [speed], [1]);
    const { waveform } = await this.model({ input_ids, style, speed: speedTensor });
    return new RawAudio(waveform.data, 24000);
  }
}

export { env };
