import type { CombineResult } from "./combineRules";
import type { Clue } from "./clueSystem";

/** Simulated processing time for the hash cracker — trace keeps ticking while this runs. */
export const CRACK_DURATION_MS = 4000;

/** Keyed by the exact encoded clue value. Values are real base64 so `atob` genuinely decodes them. */
const DECODE_RECIPES: Record<string, CombineResult> = {
  "ZGVwbG95LWJvdA==": {
    type: "username",
    value: atob("ZGVwbG95LWJvdA=="),
    label: "Decoded from a base64 comment left in the source",
  },
  "UmVjMHZlcnlTbGlwIzQ=": {
    type: "password",
    value: atob("UmVjMHZlcnlTbGlwIzQ="),
    label: "Decoded from a base64 comment left in the sync script",
  },
  "TjFtYnVzI1ZlbmQwcg==": {
    type: "pattern",
    value: atob("TjFtYnVzI1ZlbmQwcg=="),
    label: "Decoded rotation pattern from the vendor onboarding notes",
  },
  "d2VsbG5lc3Nib3Q=": {
    type: "username",
    value: atob("d2VsbG5lc3Nib3Q="),
    label: "Decoded from a base64 comment left in the config",
  },
  "QzBhc3RhbCNCcmlkZ2U=": {
    type: "pattern",
    value: atob("QzBhc3RhbCNCcmlkZ2U="),
    label: "Decoded rotation pattern from the vendor onboarding notes",
  },
  // Double-encoded chain (Chapter 3's "chained decode" twist) — decoding this once yields
  // ANOTHER encoded clue, not the final value; the player has to decode it a second time.
  "V2pCdVpWUm9jakIwZEd4bEl6VT0=": {
    type: "encoded",
    value: atob("V2pCdVpWUm9jakIwZEd4bEl6VT0="),
    label: "First layer decoded — still encoded, needs a second pass",
  },
  "WjBuZVRocjB0dGxlIzU=": {
    type: "password",
    value: atob("WjBuZVRocjB0dGxlIzU="),
    label: "Second layer decoded from the fare-zone config",
  },
  "VDBsbExpbmUjUm91dGU=": {
    type: "pattern",
    value: atob("VDBsbExpbmUjUm91dGU="),
    label: "Decoded rotation pattern from the vendor onboarding notes",
  },
  "cG9ydGZvbGlvc3Zj": {
    type: "username",
    value: atob("cG9ydGZvbGlvc3Zj"),
    label: "Decoded from a base64 comment left in the config",
  },
  "QXVyM2xpYUxpbmsjNw==": {
    type: "pattern",
    value: atob("QXVyM2xpYUxpbmsjNw=="),
    label: "Decoded rotation pattern from the vendor onboarding notes",
  },
};

/** Keyed by the exact hash clue value — simulates a cracker matching against a known wordlist. */
const CRACK_RECIPES: Record<string, CombineResult> = {
  "9f86d081884c7d659a2feaa0c55ad015": {
    type: "password",
    value: "Aut0Deploy#9",
    label: "Cracked from the rotated password hash",
  },
  "5f8a0c2e91b6d4317aa4e2c9f0b1d6a3": {
    type: "token",
    value: "AURELIA-LINK-4471",
    label: "Cracked ledger checksum — reveals an internal routing token",
  },
  "c74d97b01eae257e44aa9d5bade97baf": {
    type: "password",
    value: "C0nsentWide9!",
    label: "Cracked from the rotated password hash",
  },
  "a1b2c3d4e5f6789012345678901234ab": {
    type: "password",
    value: "St4keHidden#2",
    label: "Cracked from the rotated password hash",
  },
};

/** Keyed by the exact email clue value — simulates checking a public breach-dump database. */
const LEAK_RECIPES: Record<string, CombineResult> = {
  "jwilson@riversidehealth.org": {
    type: "password",
    value: "Sunshine88!",
    label: "Found in a public breach dump — this account reuses it",
  },
  "finops@halcyondynamics.com": {
    type: "password",
    value: "Ledger$ecure9",
    label: "Found in a public breach dump — this account reuses it",
  },
  "tokafor@alamedaregional.org": {
    type: "password",
    value: "Riverbank77!",
    label: "Found in a public breach dump — this account reuses it",
  },
  "dpatel@ferroviasystems.com": {
    type: "password",
    value: "Volt$urge42",
    label: "Found in a public breach dump — this account reuses it",
  },
  "mreyes@aureliacapital.com": {
    type: "password",
    value: "Quart3rly!9",
    label: "Found in a public breach dump — this account reuses it",
  },
};

/** Single-input transform: decode an `encoded` clue. Returns null if it doesn't decode to anything useful. */
export function tryDecode(clue: Clue): CombineResult | null {
  if (clue.type !== "encoded") return null;
  return DECODE_RECIPES[clue.value] ?? null;
}

/** Single-input transform: crack a `hash` clue. Returns null if it's not in the (simulated) wordlist. */
export function tryCrack(clue: Clue): CombineResult | null {
  if (clue.type !== "hash") return null;
  return CRACK_RECIPES[clue.value] ?? null;
}

/** Single-input transform: check an `email` clue against a leaked-credential database. */
export function tryLeakCheck(clue: Clue): CombineResult | null {
  if (clue.type !== "email") return null;
  return LEAK_RECIPES[clue.value] ?? null;
}
