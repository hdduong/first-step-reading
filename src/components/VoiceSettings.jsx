import { C, cardStyle } from "../theme.js";
import Pill from "./Pill.jsx";
import { ELEVEN_VOICES, DEVICE_VOICE } from "../lib/voices.js";

// Voice picker + speed controls. The voice list is the curated set of
// ElevenLabs voices (plus an offline device-voice option); the selected id is
// held by the useSpeech hook, where the ElevenLabs synthesis is wired in.
export default function VoiceSettings({ speech }) {
  const { voiceId, setVoice, speed, SPEEDS, changeSpeed, testVoice } = speech;
  return (
    <div
      style={{
        ...cardStyle,
        alignItems: "stretch",
        textAlign: "left",
        padding: "12px 14px",
        marginBottom: 14,
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, flex: "0 0 auto" }}>
          🗣️ Voice
        </span>
        <select
          value={voiceId}
          onChange={(e) => setVoice(e.target.value)}
          aria-label="Choose a voice"
          style={{
            flex: 1,
            minWidth: 150,
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: 14,
            padding: "8px 10px",
            borderRadius: 12,
            border: `2px solid ${C.border}`,
            color: C.blueDark,
            background: "#fff",
          }}
        >
          {ELEVEN_VOICES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.gender ? `${v.name} (${v.gender})` : v.name}
            </option>
          ))}
          <option value={DEVICE_VOICE}>📱 Device voice (offline)</option>
        </select>
        <Pill small onClick={testVoice}>
          🔊 Test
        </Pill>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14 }}>⏱️ Speed</span>
        {SPEEDS.map(([label, v]) => (
          <button
            key={label}
            className="press"
            onClick={() => changeSpeed(v)}
            style={{
              background: speed === v ? C.blue : "#fff",
              color: speed === v ? "#fff" : C.blue,
              border: `2px solid ${C.blue}`,
              borderRadius: 999,
              padding: "7px 14px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.gray }}>
        Pick the voice the app reads with. The named voices use ElevenLabs;
        “Device voice” works offline using your device’s built-in speech.
      </div>
    </div>
  );
}
