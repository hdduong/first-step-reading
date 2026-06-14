import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ELEVENLABS_VOICE_PACKS } from "../src/data/voicePacks.js";
import { clipList } from "./clip-list.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

const loadEnvFile = (file) => {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
};

loadEnvFile(join(root, ".env"));
loadEnvFile(join(root, ".env.local"));

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1] || null;
};

const usage = () => {
  console.log(`
Generate local ElevenLabs audio clips.

Examples:
  npm run audio:elevenlabs -- --voices
  npm run audio:elevenlabs -- --voices --fetch
  npm run audio:elevenlabs -- --available-voices
  npm run audio:elevenlabs -- --voice elevenlabs-voice-01 --limit 8 --dry-run
  npm run audio:elevenlabs -- --voice elevenlabs-voice-01 --folder words --limit 8
  npm run audio:elevenlabs -- --all --folder words

Options:
  --voices              List configured ElevenLabs voices.
  --fetch               With --voices, fetch names and labels from ElevenLabs.
  --available-voices    List voices available to this API key.
  --voice <id>          Generate one voice pack by app id or ElevenLabs voice id.
  --all                 Generate all configured ElevenLabs voice packs.
  --folder <name>       Filter clips to words, sounds, or letters.
  --clip <key>          Generate one clip key, such as words/cat.
  --limit <n>           Generate only the first n matching clips.
  --overwrite           Replace existing mp3 files.
  --dry-run             Print what would be generated without calling the API.
`);
};

if (hasFlag("--help")) {
  usage();
  process.exit(0);
}

const apiKey = process.env.ELEVENLABS_API_KEY;

const requestVoiceInfo = async (pack) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/voices/${pack.voiceId}`,
    {
      headers: {
        "xi-api-key": apiKey,
        Accept: "application/json",
      },
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `ElevenLabs ${response.status} ${response.statusText}: ${detail}`,
    );
  }
  return response.json();
};

const requestAvailableVoices = async () => {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": apiKey,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `ElevenLabs ${response.status} ${response.statusText}: ${detail}`,
    );
  }
  return response.json();
};

const describeVoice = (info) => {
  const labels = info.labels || {};
  const parts = [
    labels.gender,
    labels.age,
    labels.accent,
    labels.description,
    labels.use_case,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "no labels";
};

if (hasFlag("--available-voices")) {
  if (!apiKey)
    throw new Error("Missing ELEVENLABS_API_KEY in .env.local or environment.");
  const result = await requestAvailableVoices();
  const voices = result.voices || [];
  for (const voice of voices) {
    console.log(
      `${voice.voice_id}  ${voice.name} (${describeVoice(voice)})`,
    );
  }
  console.log(`\n${voices.length} available voice(s).`);
  process.exit(0);
}

if (hasFlag("--voices")) {
  const fetchVoiceLabels = hasFlag("--fetch");
  if (fetchVoiceLabels && !apiKey)
    throw new Error("Missing ELEVENLABS_API_KEY in .env.local or environment.");
  for (const pack of ELEVENLABS_VOICE_PACKS) {
    if (!fetchVoiceLabels) {
      console.log(`${pack.id.padEnd(22)} ${pack.voiceId}  ${pack.label}`);
    } else {
      try {
        const info = await requestVoiceInfo(pack);
        console.log(
          `${pack.id.padEnd(22)} ${pack.voiceId}  ${info.name} (${describeVoice(
            info,
          )})`,
        );
      } catch (error) {
        console.log(
          `${pack.id.padEnd(22)} ${pack.voiceId}  unavailable (${error.message})`,
        );
      }
    }
  }
  process.exit(0);
}

const dryRun = hasFlag("--dry-run");
const overwrite = hasFlag("--overwrite");
const voiceFilter = argValue("--voice");
const folderFilter = argValue("--folder");
const clipFilter = argValue("--clip");
const limit = Number(argValue("--limit") || 0);
const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const outputFormat =
  process.env.ELEVENLABS_OUTPUT_FORMAT || "mp3_44100_128";
const delayMs = Number(process.env.ELEVENLABS_DELAY_MS || 250);

let packs;
if (voiceFilter) {
  packs = ELEVENLABS_VOICE_PACKS.filter(
    (pack) => pack.id === voiceFilter || pack.voiceId === voiceFilter,
  );
} else if (hasFlag("--all")) {
  packs = ELEVENLABS_VOICE_PACKS;
} else {
  usage();
  throw new Error("Pick --voice <id> for a test run, or --all.");
}

if (!packs.length) throw new Error(`No ElevenLabs voice matched ${voiceFilter}`);
if (!dryRun && !apiKey)
  throw new Error("Missing ELEVENLABS_API_KEY in .env.local or environment.");

let clips = [...clipList()].sort((a, b) => a[0].localeCompare(b[0]));
if (folderFilter) {
  clips = clips.filter(([key]) => key.startsWith(`${folderFilter}/`));
}
if (clipFilter) clips = clips.filter(([key]) => key === clipFilter);
if (limit > 0) clips = clips.slice(0, limit);
if (!clips.length) throw new Error("No clips matched the selected filters.");

const targetPath = (pack, clipKey) =>
  join(root, "public", "audio", ...pack.prefix.split("/"), ...clipKey.split("/")) +
  ".mp3";

const requestAudio = async (pack, text) => {
  const url = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${pack.voiceId}`,
  );
  url.searchParams.set("output_format", outputFormat);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: Number(process.env.ELEVENLABS_STABILITY || 0.5),
        similarity_boost: Number(
          process.env.ELEVENLABS_SIMILARITY_BOOST || 0.75,
        ),
        style: Number(process.env.ELEVENLABS_STYLE || 0),
        use_speaker_boost:
          process.env.ELEVENLABS_SPEAKER_BOOST !== "false",
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `ElevenLabs ${response.status} ${response.statusText}: ${detail}`,
    );
  }
  return Buffer.from(await response.arrayBuffer());
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let written = 0;
let skipped = 0;
for (const pack of packs) {
  console.log(`\n${pack.label} -> public/audio/${pack.prefix}/`);
  for (const [clipKey, text] of clips) {
    const out = targetPath(pack, clipKey);
    if (!overwrite && existsSync(out)) {
      skipped++;
      console.log(`  skip ${clipKey}`);
      continue;
    }
    console.log(`  ${dryRun ? "would write" : "write"} ${clipKey}: ${text}`);
    if (!dryRun) {
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, await requestAudio(pack, text));
      written++;
      if (delayMs > 0) await sleep(delayMs);
    }
  }
}

console.log(`\nDone. Wrote ${written} file(s), skipped ${skipped}.`);
if (!dryRun && written > 0) console.log("Next: npm run audio:manifest");
