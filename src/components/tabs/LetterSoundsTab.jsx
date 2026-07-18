import { useEffect, useRef, useState } from "react";
import { C, cardStyle, h2Style, ring } from "../../theme.js";
import { LETTER_SOUND_SETS } from "../../data/letterSounds.js";
import PicFor from "../PicFor.jsx";
import Pill from "../Pill.jsx";
import PopOut from "../PopOut.jsx";

const BASE_URL = `${import.meta.env.BASE_URL || "/"}video/letter-sounds/`;
const videoUrl = (item) => `${BASE_URL}${item.video}`;
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export default function LetterSoundsTab({ speech }) {
  const [setIndex, setSetIndex] = useState(0);
  const [playingLetter, setPlayingLetter] = useState(null);
  const [videoLetter, setVideoLetter] = useState(null);
  const audioRef = useRef(null);
  const tabRefs = useRef([]);
  const activeSet = LETTER_SOUND_SETS[setIndex];

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingLetter(null);
  };

  useEffect(
    () => () => {
      if (audioRef.current) audioRef.current.pause();
    },
    [],
  );

  const chooseSet = (index) => {
    stopAudio();
    setSetIndex(index);
  };

  const handleSetKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % LETTER_SOUND_SETS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + LETTER_SOUND_SETS.length) % LETTER_SOUND_SETS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = LETTER_SOUND_SETS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    chooseSet(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const hearLetter = (item) => {
    speech.cancel();
    stopAudio();
    const audio = new Audio(videoUrl(item));
    audioRef.current = audio;
    audio.onplay = () => setPlayingLetter(item.letter);
    audio.onended = stopAudio;
    audio.onerror = stopAudio;
    audio.play().catch(stopAudio);
  };

  const openVideo = (item) => {
    speech.cancel();
    stopAudio();
    setVideoLetter(item);
  };

  return (
    <section aria-labelledby="letter-sounds-heading">
      <div
        style={{
          ...cardStyle,
          alignItems: "stretch",
          background: C.yellowSoft,
          padding: "14px 16px",
          marginBottom: 14,
        }}
      >
        <h2 id="letter-sounds-heading" style={{ ...h2Style, margin: 0 }}>
          Letter Sounds
        </h2>
        <div
          role="tablist"
          aria-label="Letter sound groups"
          style={{ display: "flex", gap: 6, overflowX: "auto", padding: 3 }}
        >
          {LETTER_SOUND_SETS.map((set, index) => (
            <button
              key={set.id}
              id={`letter-sound-tab-${set.id}`}
              type="button"
              role="tab"
              aria-selected={index === setIndex}
              aria-controls="letter-sound-panel"
              tabIndex={index === setIndex ? 0 : -1}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className="press"
              onClick={() => chooseSet(index)}
              onKeyDown={(event) => handleSetKeyDown(event, index)}
              style={{
                flex: "1 1 54px",
                minWidth: 54,
                minHeight: 42,
                border: `2px solid ${C.blue}`,
                borderRadius: 999,
                background: index === setIndex ? C.blue : "#fff",
                color: index === setIndex ? "#fff" : C.blue,
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {set.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="letter-sound-panel"
        role="tabpanel"
        aria-labelledby={`letter-sound-tab-${activeSet.id}`}
        tabIndex={0}
      >
        <h2 style={h2Style}>{activeSet.label}</h2>
        <div className="letter-sound-grid">
          {activeSet.letters.map((item) => {
            const isVowel = VOWELS.has(item.letter);
            const isPlaying = playingLetter === item.letter;
            const upper = item.letter.toUpperCase();

            return (
              <article
                key={item.letter}
                data-letter-sound={item.letter}
                style={{
                  ...cardStyle,
                  minHeight: 236,
                  justifyContent: "space-between",
                  background: isVowel ? C.yellowSoft : "#fff",
                  boxShadow: isPlaying ? ring : "0 2px 0 rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <div
                    style={{
                      color: isVowel ? C.red : C.blue,
                      fontSize: 54,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {upper}
                    <span style={{ fontSize: 38 }}>{item.letter}</span>
                  </div>
                  <div
                    style={{
                      height: 64,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PicFor pic={item.pic} size={50} />
                  </div>
                  <div
                    style={{ color: C.blueDark, fontSize: 17, fontWeight: 700 }}
                  >
                    {item.word}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 7,
                    flexWrap: "wrap",
                  }}
                >
                  <Pill small onClick={() => hearLetter(item)}>
                    🔊 Hear
                  </Pill>
                  <Pill small bg={C.green} onClick={() => openVideo(item)}>
                    ▶ Video
                  </Pill>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {videoLetter && (
        <PopOut
          label={`${videoLetter.letter.toUpperCase()} letter sound video`}
          onClose={() => setVideoLetter(null)}
          maxWidth={620}
          padding="48px 14px 14px"
        >
          <div style={{ color: C.blueDark, fontSize: 22, fontWeight: 700 }}>
            {videoLetter.letter.toUpperCase()}
            {videoLetter.letter} as in {videoLetter.word}
          </div>
          <video
            src={videoUrl(videoLetter)}
            controls
            autoPlay
            playsInline
            style={{
              width: "100%",
              border: `3px solid ${C.border}`,
              borderRadius: 12,
              background: "#000",
            }}
          />
        </PopOut>
      )}
    </section>
  );
}
