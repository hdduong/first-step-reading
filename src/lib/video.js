import { VIDEO_CLIPS } from "./video-clips-manifest.js";

const ENV = (typeof import.meta !== "undefined" && import.meta.env) || {};
const BASE = `${ENV.BASE_URL || "/"}video/disk-clips/`;

export const videoWordKey = (word) =>
  String(word || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

export const videoClipsForWord = (word) => VIDEO_CLIPS[videoWordKey(word)] || [];

export const hasVideoClip = (word) => videoClipsForWord(word).length > 0;

export const videoUrl = (clip) => `${BASE}${clip.path}`;
