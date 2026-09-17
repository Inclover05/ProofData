import { deflateRawSync, inflateRawSync } from "node:zlib";
import { keccak256, toHex } from "viem";

export const MAX_SNAPSHOT_INPUT_CHARS = 12_000;
export const MAX_SNAPSHOT_TOKEN_CHARS = 7_000;
export const MAX_SNAPSHOT_BYTES = 24 * 1024;

function normalizeCapturedText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
}

export function buildSnapshotText(sourceUrl: string, capturedText: string, captureMethod: string) {
  const normalized = normalizeCapturedText(capturedText);
  if (!normalized) throw new Error("Paste the visible listing or product text you want ProofData to evaluate.");
  if (normalized.length > MAX_SNAPSHOT_INPUT_CHARS) throw new Error("Keep the captured evidence under 12,000 characters for this prototype.");

  return [
    "PROOFDATA FIXED EVIDENCE SNAPSHOT",
    `Original source URL: ${sourceUrl}`,
    `Capture method: ${captureMethod}`,
    "Important: This snapshot preserves the exact text evaluated by validators. It does not independently prove publisher identity or that the source claims are true.",
    "",
    "--- BEGIN CAPTURED EVIDENCE ---",
    normalized,
    "--- END CAPTURED EVIDENCE ---",
  ].join("\n");
}

export function createSnapshotPayload(sourceUrl: string, capturedText: string, captureMethod: string) {
  const snapshot = buildSnapshotText(sourceUrl, capturedText, captureMethod);
  const bytes = new TextEncoder().encode(snapshot);
  if (bytes.byteLength > MAX_SNAPSHOT_BYTES) throw new Error("This snapshot is too large for the current prototype.");

  const token = deflateRawSync(Buffer.from(bytes), { level: 9 }).toString("base64url");
  if (token.length > MAX_SNAPSHOT_TOKEN_CHARS) throw new Error("This snapshot is too large to create a stable evidence URL.");

  return {
    snapshot,
    bytes,
    token,
    hash: keccak256(toHex(bytes)).slice(2),
  };
}

export function decodeSnapshotToken(token: string) {
  if (!token || token.length > MAX_SNAPSHOT_TOKEN_CHARS) throw new Error("Invalid snapshot.");
  const packed = Buffer.from(token, "base64url");
  const decoded = inflateRawSync(packed);
  if (decoded.byteLength > MAX_SNAPSHOT_BYTES) throw new Error("Snapshot too large.");
  return new TextDecoder("utf-8", { fatal: true }).decode(decoded);
}
