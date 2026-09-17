import { deflateRawSync, inflateRawSync } from "node:zlib";
import { NextResponse } from "next/server";
import { keccak256, toHex } from "viem";

export const runtime = "nodejs";

const MAX_INPUT_CHARS = 12_000;
const MAX_TOKEN_CHARS = 12_000;
const MAX_SNAPSHOT_BYTES = 24 * 1024;

function normalizeSourceUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Paste the original public HTTPS link first.");
  const url = new URL(value.trim());
  if (url.protocol !== "https:") throw new Error("The original source must use HTTPS.");
  return url.toString();
}

function buildSnapshot(sourceUrl: string, capturedText: string) {
  const normalized = capturedText.replace(/\r\n/g, "\n").trim();
  if (!normalized) throw new Error("Paste the visible listing or product text you want ProofData to evaluate.");
  if (normalized.length > MAX_INPUT_CHARS) throw new Error("Keep the captured evidence under 12,000 characters for this prototype.");

  return [
    "PROOFDATA FIXED EVIDENCE SNAPSHOT",
    `Original source URL: ${sourceUrl}`,
    "Capture method: User-supplied visible text from the referenced page.",
    "Important: This snapshot preserves the exact text evaluated by validators. It does not independently prove publisher identity or that the source claims are true.",
    "",
    "--- BEGIN CAPTURED EVIDENCE ---",
    normalized,
    "--- END CAPTURED EVIDENCE ---",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sourceUrl?: unknown; text?: unknown };
    const sourceUrl = normalizeSourceUrl(body.sourceUrl);
    if (typeof body.text !== "string") throw new Error("Paste the visible evidence text first.");

    const snapshot = buildSnapshot(sourceUrl, body.text);
    const bytes = new TextEncoder().encode(snapshot);
    if (bytes.byteLength > MAX_SNAPSHOT_BYTES) throw new Error("This snapshot is too large for the current prototype.");

    const token = deflateRawSync(Buffer.from(bytes), { level: 9 }).toString("base64url");
    if (token.length > MAX_TOKEN_CHARS) throw new Error("This snapshot is too large to create a stable evidence URL.");

    const origin = new URL(request.url).origin;
    const url = `${origin}/api/evidence/snapshot?d=${encodeURIComponent(token)}`;
    const hash = keccak256(toHex(bytes)).slice(2);

    return NextResponse.json({
      url,
      hash,
      bytes: bytes.byteLength,
      contentType: "text/plain; charset=utf-8",
      stable: true,
      snapshot: true,
      originalUrl: sourceUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create a fixed evidence snapshot.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("d") || "";
    if (!token || token.length > MAX_TOKEN_CHARS) return new Response("Invalid snapshot.", { status: 400 });

    const packed = Buffer.from(token, "base64url");
    const decoded = inflateRawSync(packed);
    if (decoded.byteLength > MAX_SNAPSHOT_BYTES) return new Response("Snapshot too large.", { status: 413 });

    const text = new TextDecoder("utf-8", { fatal: true }).decode(decoded);
    return new Response(text, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new Response("Invalid snapshot.", { status: 400 });
  }
}
