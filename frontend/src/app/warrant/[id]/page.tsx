import Link from "next/link";
import { FINAL_PROOF } from "@/lib/genlayer/config";
import { readWarrant } from "@/lib/genlayer/warrant-reader";

export const dynamic = "force-dynamic";
import { AdjudicateAction } from "@/components/AdjudicateAction";

type WarrantStatus = "PENDING" | "WARRANTED" | "CONDITIONAL" | "NOT_WARRANTED" | "INCONCLUSIVE" | "PENDING_AI";

interface WarrantData {
  id: string;
  status: WarrantStatus;
  evidenceUrl: string;
  evidenceHash: string;
  intendedAction: string;
  riskLevel: string;
  requester: string;
  timestamp: string;
  reason: string;
}

const STATUS_CONFIG: Record<string, { label: string; textClass: string; bgClass: string; borderClass: string }> = {
  PENDING: {
    label: "PENDING EVIDENCE VALIDATION",
    textClass: "text-[#4A5568]",
    bgClass: "bg-[#E2E8F0]",
    borderClass: "border-[#4A5568]/20"
  },
  PENDING_AI: {
    label: "AWAITING ADJUDICATION",
    textClass: "text-[#4A5568]",
    bgClass: "bg-[#E2E8F0]",
    borderClass: "border-[#4A5568]/20"
  },
  WARRANTED: {
    label: "WARRANTED",
    textClass: "text-[#005530]",
    bgClass: "bg-[#E6F4EA]",
    borderClass: "border-[#005530]/20"
  },
  CONDITIONAL: {
    label: "CONDITIONAL",
    textClass: "text-[#B05B00]",
    bgClass: "bg-[#FFF0E0]",
    borderClass: "border-[#B05B00]/20"
  },
  NOT_WARRANTED: {
    label: "NOT WARRANTED",
    textClass: "text-[#800010]",
    bgClass: "bg-[#FEE7EA]",
    borderClass: "border-[#800010]/20"
  },
  INCONCLUSIVE: {
    label: "INCONCLUSIVE",
    textClass: "text-[#4A5568]",
    bgClass: "bg-[#E2E8F0]",
    borderClass: "border-[#4A5568]/20"
  }
};

export default async function WarrantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let data: WarrantData | null = null;
  let errorMsg = null;
  const warrantId = resolvedParams.id === "demo-low" ? FINAL_PROOF.lowWarrantId : resolvedParams.id.startsWith("demo") ? FINAL_PROOF.highWarrantId : resolvedParams.id;
  try {
    const w = await readWarrant(warrantId);
    data = { id: w.id, status: w.status as WarrantStatus, evidenceUrl: w.evidence_ref,
      evidenceHash: w.expected_hash, intendedAction: w.purpose, riskLevel: w.risk_level,
      requester: w.requester, timestamp: String(w.expires_at),
      reason: "This contract stores the verdict only; it does not store the adjudication reason." };
  } catch {
    errorMsg = "Unable to read this warrant from Bradbury. It may not exist, or the network may be unavailable.";
  }

  if (errorMsg || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        <h1 className="text-4xl font-bold text-red-500 mb-4">{errorMsg || "UNKNOWN ERROR"}</h1>
        <p className="text-text-secondary">Unable to load reliance warrant: {resolvedParams.id}</p>
        <div className="mt-8">
          <Link href="/warrant/demo" className="text-brand hover:underline mr-4">View Final HIGH Proof</Link>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[data.status] || STATUS_CONFIG["PENDING"];

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden py-16 px-6">
      <div className="absolute inset-0 z-0 bg-bg-deep-graphite pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-20 reliance-field pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 bg-[#FDFDFD] text-[#0A0E17] shadow-2xl rounded-sm overflow-visible animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        <div className={`p-10 md:p-16 border-b rounded-t-sm ${config.borderClass} ${config.bgClass} flex flex-col md:flex-row md:items-end justify-between gap-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-15 hidden md:block">
            {data.status === "WARRANTED" && (
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className={config.textClass}>
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
                <path d="M30 50 L45 65 L75 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {data.status === "NOT_WARRANTED" && (
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className={config.textClass}>
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
                <path d="M35 35 L65 65 M65 35 L35 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {data.status === "CONDITIONAL" && (
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className={config.textClass}>
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
                <path d="M50 25 L50 60 M50 70 L50 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {(data.status === "PENDING" || data.status === "PENDING_AI" || data.status === "INCONCLUSIVE") && (
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className={config.textClass}>
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" />
                <path d="M50 15L50 85" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3"/>
                <path d="M15 50L85 50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3"/>
                <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" />
                <path d="M42 50l6 6 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
              </svg>
            )}
          </div>
          
          <div className="relative z-10">
            <div className={`text-[11px] uppercase tracking-[0.2em] font-mono mb-4 font-bold border-b pb-2 inline-block ${config.borderClass} ${config.textClass}`}>
              RELIANCE WARRANT <span className="opacity-50 mx-2">{"//"}</span> <span className="font-bold tracking-widest">{data.id.replace('warrant-', '').substring(0,8).toUpperCase()}</span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tight ${config.textClass} drop-shadow-sm`}>
              {config.label}
            </h1>
          </div>
          {(data.status === "PENDING" || data.status === "PENDING_AI") && (
            <div className="flex items-center gap-3 relative z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A5568] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A5568]"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#4A5568]">
                {data.status === "PENDING_AI" ? "Awaiting Adjudication" : "Evidence Validation Required"}
              </span>
            </div>
          )}
        </div>

        <div className="p-10 md:p-16 grid grid-cols-1 md:grid-cols-12 gap-16 relative">
          <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0A0E17 1px, transparent 1px), linear-gradient(90deg, #0A0E17 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
          
          <div className="md:col-span-8 space-y-12 relative z-10">
            {['WARRANTED', 'CONDITIONAL', 'NOT_WARRANTED', 'INCONCLUSIVE'].includes(data.status) && (
              <section>
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-3 mb-4 font-semibold">Adjudication Reason</h2>
                <p className="text-lg leading-loose text-[#0A0E17]">
                  {data.reason || "No explicit reason was returned by the validator network."}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-3 mb-4 font-semibold">Intended Action</h2>
              <p className="leading-relaxed text-[#0A0E17] font-medium">
                {data.intendedAction}
              </p>
            </section>

            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-3 mb-4 font-semibold">Evidence Identity</h2>
              <div className="bg-[#F5F7FA] border border-[#0A0E17]/10 p-5 space-y-4 rounded-sm">
                <div>
                  <div className="text-[10px] text-[#4A5568] font-mono mb-1 uppercase tracking-widest">Source URL</div>
                  <a href={data.evidenceUrl} className="text-sm text-[#2B5CFF] hover:underline break-all block">{data.evidenceUrl}</a>
                </div>
                <div>
                  <div className="text-[10px] text-[#4A5568] font-mono mb-2 uppercase tracking-widest font-bold">Fingerprint (Keccak-256)</div>
                  <div className="text-base sm:text-lg font-mono break-all bg-[#0A0E17] text-white p-4 border border-[#0A0E17]/10 flex items-center gap-3 shadow-md">
                    <svg className="w-5 h-5 text-[#2B5CFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    {data.evidenceHash}
                  </div>
                </div>
              </div>
            </section>
            
            {["PENDING", "PENDING_AI"].includes(data.status) && (
              <AdjudicateAction key={data.status} warrantId={data.id} method={data.status === "PENDING" ? "retrieve_and_validate" : "adjudicate"} />
            )}
            
          </div>

          <div className="md:col-span-4 space-y-10 relative z-10 border-t md:border-t-0 md:border-l border-[#0A0E17]/10 pt-10 md:pt-0 md:pl-10">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] mb-2 font-semibold">Risk Level</h2>
              <div className="text-sm font-bold tracking-wider">{data.riskLevel}</div>
            </div>
            

            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] mb-2 font-semibold">Requester</h2>
              <div className="text-xs font-mono break-all">{data.requester}</div>
            </div>

            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] mb-2 font-semibold">Protocol</h2>
              <div className="text-xs font-mono">GenLayer (Bradbury, chain 4221)</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center text-[10px] font-mono tracking-widest text-text-secondary relative z-10">
        <Link href={`/warrant/${FINAL_PROOF.lowWarrantId}`} className="hover:text-white transition-colors border border-[#4A5568]/50 px-4 py-2">FINAL LOW PROOF</Link>
        <div className="flex gap-4">
          <Link href="/warrant/demo-low" className="hover:text-white transition-colors">LOW PROOF</Link>
          <Link href="/warrant/demo" className="hover:text-white transition-colors">HIGH PROOF</Link>
        </div>
      </div>
    </div>
  );
}
