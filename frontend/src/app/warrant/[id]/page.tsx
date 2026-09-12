import Link from "next/link";
import { use } from "react";

type WarrantStatus = "PENDING" | "WARRANTED" | "CONDITIONAL" | "NOT_WARRANTED" | "INCONCLUSIVE";

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
  conditions?: string;
}

const DEMO_DATA: Record<string, WarrantData> = {
  "pending-demo": {
    id: "wd_0x7f8a9b2c3d4e5f6g",
    status: "PENDING",
    evidenceUrl: "https://api.example.com/market-report/v2",
    evidenceHash: "0xPENDING...",
    intendedAction: "Execute an autonomous trade of 50 WETH based on this intelligence report.",
    riskLevel: "HIGH",
    requester: "0x1234...5678",
    timestamp: new Date().toISOString(),
    reason: "Awaiting GenLayer consensus to validate evidence against intended consequence.",
  },
  "demo": {
    id: "wd_0x9a8b7c6d5e4f3g2h",
    status: "NOT_WARRANTED",
    evidenceUrl: "https://api.example.com/market-report/v2",
    evidenceHash: "0x8f7d9a1b2c3d4e5f6g7h8i9j0k1l2m3n",
    intendedAction: "Execute an autonomous trade of 50 WETH based on this intelligence report.",
    riskLevel: "HIGH",
    requester: "0x1234...5678",
    timestamp: "2026-09-12T14:30:00Z",
    reason: "Evidence is insufficient for a HIGH risk action. The source material lacks cryptographically verifiable signatures and contains probabilistic language ('likely', 'potentially') unsuitable for autonomous execution.",
  },
  "demo-low": {
    id: "wd_0x1a2b3c4d5e6f7g8h",
    status: "WARRANTED",
    evidenceUrl: "https://api.example.com/market-report/v2",
    evidenceHash: "0x8f7d9a1b2c3d4e5f6g7h8i9j0k1l2m3n",
    intendedAction: "Include findings in internal weekly research summary.",
    riskLevel: "LOW",
    requester: "0x1234...5678",
    timestamp: "2026-09-12T14:35:00Z",
    reason: "Evidence is sufficient for LOW risk research purposes. The source is a known analytical endpoint and the contents are internally consistent.",
  }
};

const STATUS_CONFIG = {
  PENDING: {
    label: "PENDING CONSENSUS",
    textClass: "text-text-primary",
    bgClass: "bg-rules-borders",
    borderClass: "border-rules-borders"
  },
  WARRANTED: {
    label: "WARRANTED",
    textClass: "text-[#005924]", // Using raw hex for precise matching as defined in tokens
    bgClass: "bg-[#E3F5EA]",
    borderClass: "border-[#005924]/20"
  },
  CONDITIONAL: {
    label: "CONDITIONAL",
    textClass: "text-[#944C00]",
    bgClass: "bg-[#FFF0D4]",
    borderClass: "border-[#944C00]/20"
  },
  NOT_WARRANTED: {
    label: "NOT WARRANTED",
    textClass: "text-[#8A0012]",
    bgClass: "bg-[#FEE7EA]",
    borderClass: "border-[#8A0012]/20"
  },
  INCONCLUSIVE: {
    label: "INCONCLUSIVE",
    textClass: "text-[#4A5568]",
    bgClass: "bg-[#EDF2F7]",
    borderClass: "border-[#4A5568]/20"
  }
};

export default function WarrantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const data = DEMO_DATA[resolvedParams.id] || DEMO_DATA["demo"];
  const config = STATUS_CONFIG[data.status];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      {/* Dossier Shell */}
      <div className="bg-surface border border-rules shadow-sm">
        
        {/* Header / Verdict */}
        <div className={`p-8 md:p-12 border-b ${config.borderClass} ${config.bgClass} flex flex-col md:flex-row md:items-end justify-between gap-6`}>
          <div>
            <div className="text-xs uppercase tracking-widest font-mono mb-2 opacity-70 {config.textClass}">Reliance Warrant // {data.id}</div>
            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${config.textClass}`}>
              {config.label}
            </h1>
          </div>
          {data.status === "PENDING" && (
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-text-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-text-primary"></span>
              </span>
              <span className="text-sm font-mono uppercase tracking-widest">GenVM Processing</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Main Column */}
          <div className="md:col-span-8 space-y-10">
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-text-secondary border-b border-rules pb-2 mb-4">Adjudication Reason</h2>
              <p className="text-lg leading-relaxed text-text-primary">
                {data.reason}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-text-secondary border-b border-rules pb-2 mb-4">Intended Action</h2>
              <p className="leading-relaxed text-text-primary">
                {data.intendedAction}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-text-secondary border-b border-rules pb-2 mb-4">Evidence Identity</h2>
              <div className="bg-background border border-rules p-4 space-y-3">
                <div>
                  <div className="text-xs text-text-secondary font-mono mb-1">Source URL</div>
                  <a href={data.evidenceUrl} className="text-sm text-accent hover:underline break-all block">{data.evidenceUrl}</a>
                </div>
                <div>
                  <div className="text-xs text-text-secondary font-mono mb-1">Fingerprint (SHA-256)</div>
                  <div className="text-sm font-mono break-all bg-surface p-2 border border-rules-borders/50 flex items-center gap-2">
                    <svg className="w-4 h-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    {data.evidenceHash}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Metadata Rail */}
          <div className="md:col-span-4 space-y-8">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">Risk Level</h2>
              <div className="text-sm font-semibold">{data.riskLevel}</div>
            </div>
            
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">Timestamp</h2>
              <div className="text-sm font-mono">{new Date(data.timestamp).toLocaleString()}</div>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">Requester</h2>
              <div className="text-sm font-mono">{data.requester}</div>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">Protocol</h2>
              <div className="text-sm font-mono">GenLayer (Studionet)</div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Debug/Demo navigation */}
      <div className="mt-8 flex gap-4 justify-center text-sm font-mono text-text-secondary">
        <Link href="/warrant/demo-low" className="hover:text-text-primary underline">Demo: LOW (Warranted)</Link>
        <Link href="/warrant/demo" className="hover:text-text-primary underline">Demo: HIGH (Not Warranted)</Link>
      </div>
    </div>
  );
}
