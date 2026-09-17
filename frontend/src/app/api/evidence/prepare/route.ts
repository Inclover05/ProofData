import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { keccak256, toHex } from "viem";

export const runtime = "nodejs";

const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 12_000;

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase().split("%")[0];
  if (isIP(normalized) === 4) return isPrivateIpv4(normalized);
  if (isIP(normalized) === 6) {
    if (normalized === "::" || normalized === "::1") return true;
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    if (/^fe[89ab]/.test(normalized)) return true;
    const mapped = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIpv4(mapped[1]);
  }
  return false;
}

async function assertPublicHttps(url: URL) {
  if (url.protocol !== "https:") throw new Error("Use a public HTTPS link.");
  if (url.username || url.password) throw new Error("Links with embedded usernames or passwords are not supported.");

  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost")) throw new Error("Local network links are not supported.");

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error("Private or local network links are not supported.");
    return;
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(entry => isPrivateAddress(entry.address))) {
    throw new Error("This link does not resolve to a public internet address.");
  }
}

function isTextLike(contentType: string) {
  const type = contentType.toLowerCase();
  return (
    type.startsWith("text/") ||
    type.includes("application/json") ||
    type.includes("application/javascript") ||
    type.includes("application/xml") ||
    type.includes("application/xhtml+xml")
  );
}

async function fetchEvidence(input: string) {
  let current = new URL(input);

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertPublicHttps(current);

    const response = await fetch(current, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        accept: "text/plain,text/html,application/json,application/xml;q=0.9,*/*;q=0.1",
        "user-agent": "ProofData-Evidence-Capture/1.0",
      },
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The evidence link redirected without a destination.");
      current = new URL(location, current);
      continue;
    }

    if (!response.ok) {
      const error = new Error(`The evidence page returned HTTP ${response.status}.`) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!isTextLike(contentType)) {
      throw new Error("This version of ProofData currently supports public text, HTML, JSON, and XML evidence.");
    }

    const announcedLength = Number(response.headers.get("content-length") || 0);
    if (announcedLength > MAX_BYTES) throw new Error("This evidence is too large for the current prototype (512 KB maximum).");

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > MAX_BYTES) throw new Error("This evidence is too large for the current prototype (512 KB maximum).");

    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new Error("The evidence must be valid UTF-8 text for the current adjudication contract.");
    }

    return {
      bytes,
      resolvedUrl: current.toString(),
      contentType,
    };
  }

  throw new Error("The evidence link redirected too many times.");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown };
    if (typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json({ error: "Paste a public evidence link first." }, { status: 400 });
    }

    let first;
    try {
      first = await fetchEvidence(body.url.trim());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to fetch this evidence.";
      const status = typeof error === "object" && error && "status" in error ? Number((error as { status?: unknown }).status) : 0;
      const snapshotRecommended = status === 401 || status === 403 || status === 429;
      return NextResponse.json({ error: message, snapshotRecommended, reason: snapshotRecommended ? "blocked" : "fetch" }, { status: 422 });
    }

    let second;
    try {
      second = await fetchEvidence(first.resolvedUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to verify this evidence a second time.";
      const status = typeof error === "object" && error && "status" in error ? Number((error as { status?: unknown }).status) : 0;
      const snapshotRecommended = status === 401 || status === 403 || status === 429;
      return NextResponse.json({ error: message, snapshotRecommended, reason: snapshotRecommended ? "blocked" : "fetch" }, { status: 422 });
    }

    const firstHash = keccak256(toHex(first.bytes)).slice(2);
    const secondHash = keccak256(toHex(second.bytes)).slice(2);

    if (firstHash !== secondHash) {
      return NextResponse.json(
        {
          error: "This page changes between requests, so the full webpage cannot be locked byte-for-byte.",
          unstable: true,
          snapshotRecommended: true,
          reason: "unstable",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      url: first.resolvedUrl,
      hash: firstHash,
      bytes: first.bytes.byteLength,
      contentType: first.contentType,
      stable: true,
    });
  } catch {
    return NextResponse.json({ error: "Unable to prepare this evidence link." }, { status: 500 });
  }
}
