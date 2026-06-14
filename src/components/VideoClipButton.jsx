import { useState } from "react";
import { C, cardStyle } from "../theme.js";
import { videoClipsForWord, videoUrl } from "../lib/video.js";
import Pill from "./Pill.jsx";

export default function VideoClipButton({ word, small = true }) {
  const clips = videoClipsForWord(word);
  const [activeIndex, setActiveIndex] = useState(null);
  if (!clips.length) return null;

  const activeClip = activeIndex === null ? null : clips[activeIndex];

  return (
    <>
      <Pill small={small} bg={C.green} onClick={() => setActiveIndex(0)}>
        Video
      </Pill>
      {activeClip && (
        <div
          onClick={() => setActiveIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(20,30,60,0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${word} video clip`}
            onClick={(e) => e.stopPropagation()}
            style={{
              ...cardStyle,
              position: "relative",
              alignItems: "stretch",
              width: "100%",
              maxWidth: 620,
              padding: "44px 14px 14px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close video"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `3px solid ${C.border}`,
                background: "#fff",
                color: C.blueDark,
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              x
            </button>
            <div
              style={{
                color: C.blueDark,
                fontWeight: 700,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {word} from {activeClip.disk}
            </div>
            {clips.length > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {clips.map((clip, i) => (
                  <button
                    key={clip.path}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    style={{
                      background: i === activeIndex ? C.blue : "#fff",
                      color: i === activeIndex ? "#fff" : C.blue,
                      border: `2px solid ${C.blue}`,
                      borderRadius: 999,
                      padding: "6px 12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {clip.disk}
                  </button>
                ))}
              </div>
            )}
            <video
              key={activeClip.path}
              src={videoUrl(activeClip)}
              controls
              autoPlay
              playsInline
              style={{
                width: "100%",
                borderRadius: 12,
                border: `3px solid ${C.border}`,
                background: "#000",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
