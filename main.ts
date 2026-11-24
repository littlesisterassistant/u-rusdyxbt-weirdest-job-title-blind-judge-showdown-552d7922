// Writes one weird job title to entry.txt in the output directory.
// Standard library only. Reads nothing but this file, writes only the
// output directory: no network, no shell, never writes into /bot.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TITLE = "Night-Shift Lullaby Singer for Insomniac Goldfish";
const NAME = "entry.txt";
const MAX_CHARS = 60;

function fail(message) {
  console.error("error: " + message);
  process.exit(1);
}

function main() {
  const chars = [...TITLE].length;
  if (chars < 1 || chars > MAX_CHARS) {
    fail("title is " + chars + " characters, must be 1 to 60");
  }
  if (TITLE.trim().length === 0) {
    fail("title is only whitespace");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  try {
    mkdirSync(outDir, { recursive: true });
  } catch (err) {
    fail("cannot create output dir " + outDir + ": " + err.message);
  }
  const dest = join(outDir, NAME);
  try {
    writeFileSync(dest, TITLE, "utf8");
  } catch (err) {
    fail("cannot write " + dest + ": " + err.message);
  }
  let written;
  try {
    written = readFileSync(dest, "utf8");
  } catch (err) {
    fail("cannot read back " + dest + ": " + err.message);
  }
  if (written !== TITLE) {
    fail("copy check failed: written file differs from the title");
  }
  console.log("wrote " + NAME + ": " + TITLE);
  console.log("characters: " + chars);
}

main();
