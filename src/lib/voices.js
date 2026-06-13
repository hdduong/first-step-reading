// Curated ElevenLabs voices shown in the in-app voice picker.
//
// Voice IDs are NOT secret (they're fine to commit). The ElevenLabs API key is
// what authenticates requests — it is entered in the app's Voice settings and
// stored only on the device (never committed here).
//
// Add an entry per voice you want to offer: { id, name, gender }.
// `gender` is just a label for the dropdown ("Female"/"Male"/"" ).

export const DEFAULT_VOICE_ID = "WZlYpi1yf6zJhNWXih74";

export const ELEVEN_VOICES = [
  { id: "WZlYpi1yf6zJhNWXih74", name: "Default", gender: "" },
  // Add the rest of your voices here, for example:
  // { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "Female" },
  // { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "Male" },
];

// Model used for synthesis. Flash is fast and low-cost — good for short words
// and sentences. Swap to "eleven_multilingual_v2" for maximum quality if your
// plan prefers it.
export const EL_MODEL_ID = "eleven_flash_v2_5";

// Special picker value meaning "use the device's built-in (offline) voice".
export const DEVICE_VOICE = "device";
