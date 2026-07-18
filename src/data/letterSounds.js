const EXAMPLES = {
  a: { word: "apple", pic: "🍎" },
  b: { word: "ball", pic: "⚽" },
  c: { word: "cat", pic: "🐱" },
  d: { word: "dog", pic: "🐶" },
  e: { word: "elephant", pic: "🐘" },
  f: { word: "fish", pic: "🐟" },
  g: { word: "goat", pic: "🐐" },
  h: { word: "hippo", pic: "🦛" },
  i: { word: "igloo", pic: "🧊" },
  j: { word: "jelly", pic: "🍇" },
  k: { word: "kite", pic: "🪁" },
  l: { word: "lion", pic: "🦁" },
  m: { word: "monkey", pic: "🐒" },
  n: { word: "nest", pic: "🪺" },
  o: { word: "octopus", pic: "🐙" },
  p: { word: "pudding", pic: "🍮" },
  q: { word: "queen", pic: "👑" },
  r: { word: "rabbit", pic: "🐰" },
  s: { word: "sand", pic: "🏖️" },
  t: { word: "turtle", pic: "🐢" },
  u: { word: "umbrella", pic: "☂️" },
  v: { word: "vase", pic: "🏺" },
  w: { word: "walrus", pic: "🦭" },
  x: { word: "xylophone", pic: "🎵" },
  y: { word: "yam", pic: "🍠" },
  z: { word: "zipper", pic: "🤐" },
};

const makeLetter = (letter) => ({
  letter,
  ...EXAMPLES[letter],
  video: `Disk1/${letter}.mp4`,
});

export const LETTER_SOUND_SETS = [
  { id: "a-e", label: "A-E", letters: "abcde".split("").map(makeLetter) },
  { id: "f-j", label: "F-J", letters: "fghij".split("").map(makeLetter) },
  { id: "k-o", label: "K-O", letters: "klmno".split("").map(makeLetter) },
  { id: "p-t", label: "P-T", letters: "pqrst".split("").map(makeLetter) },
  { id: "u-z", label: "U-Z", letters: "uvwxyz".split("").map(makeLetter) },
];

export const LETTER_SOUNDS = LETTER_SOUND_SETS.flatMap((set) => set.letters);
