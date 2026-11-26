// One Emoji, One Smile — make.fun entry
// Writes exactly one emoji to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// Node 22+, standard library only. No network, no randomness, no secrets.
//
// The entry is 🫶 (U+1FAF6 HEART HANDS): two hands shaping a heart.
// It is warm at first glance, readable by a stranger of any age or
// background with no context, and it is a deliberate choice rather than
// the default smiley — a small gesture of warmth offered, not a face
// performing one.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "🫶";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry must not be empty");
  }
  // Gate: /output/entry.txt must be UTF-8 text of 1 to 8 characters,
  // not only white space. Count code points, not UTF-16 units, so a
  // single astral-plane emoji counts as one character.
  const chars = [...text];
  if (chars.length < 1 || chars.length > 8) {
    throw new Error(`entry must be 1-8 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (chars.length !== 1) {
    throw new Error("entry must be exactly one emoji");
  }
  if (!/\p{Extended_Pictographic}/u.test(chars[0]!)) {
    throw new Error("entry must be an emoji");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Read the file back and re-check it: the program only exits cleanly
// when what is on disk is exactly the validated entry, byte for byte.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt on disk does not match the validated entry");
}
validate(written);
