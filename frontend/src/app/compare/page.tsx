import Link from "next/link";
import { FINAL_PROOF } from "@/lib/genlayer/config";
import { readWarrant } from "@/lib/genlayer/warrant-reader";

export const dynamic = "force-dynamic";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ left?: string | string[]; right?: string | string[] }> }) {
  const query = await searchParams;
  const leftId = typeof query.left === "string" ? query.left : FINAL_PROOF.lowWarrantId;
  const rightId = typeof query.right === "string" ? query.right : FINAL_PROOF.highWarrantId;
  const [leftRead, rightRead] = await Promise.allSettled([readWarrant(leftId), readWarrant(rightId)]);
  const leftData = leftRead.status === "fulfilled" ? leftRead.value : null;
  const rightData = rightRead.status === "fulfilled" ? rightRead.value : null;

  if (!leftData || !rightData) {
    // If we're missing the high warrant (e.g. before it's created), show a loading/waiting state for P6
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
        <h1 className="text-3xl font-bold font-mono tracking-widest text-text-dark mb-4">COMPARISON UNAVAILABLE</h1>
        <p className="text-text-dark-secondary mb-8 text-center max-w-lg">
          Unable to read both warrants from Bradbury. A record may be unavailable or the network may be unreachable.<br/><br/>
          Left: {leftId} ({leftData ? 'FOUND' : 'READ UNAVAILABLE'})<br/>
          Right: {rightId} ({rightData ? 'FOUND' : 'READ UNAVAILABLE'})
        </p>
        <a href="/compare" className="bg-[#0A0E17] text-white px-8 py-3 text-sm font-mono tracking-widest uppercase hover:bg-black transition-colors">
          RELOAD CONTRACT DATA
        </a>
      </div>
    );
  }

  const sameRequirements = JSON.stringify(leftData.requirements) === JSON.stringify(rightData.requirements);
  const isSameEvidence = leftData.evidence_ref === rightData.evidence_ref && leftData.expected_hash === rightData.expected_hash;

  const STATUS_COLORS: Record<string, string> = {
    "WARRANTED": "text-[#005530] bg-[#E6F4EA] border-[#005530]/20",
    "NOT_WARRANTED": "text-[#800010] bg-[#FEE7EA] border-[#800010]/20",
    "CONDITIONAL": "text-[#B05B00] bg-[#FFF0E0] border-[#B05B00]/20",
    "INCONCLUSIVE": "text-[#4A5568] bg-[#E2E8F0] border-[#4A5568]/20",
    "PENDING_AI": "text-[#4A5568] bg-[#E2E8F0] border-[#4A5568]/20",
    "PENDING": "text-[#4A5568] bg-[#E2E8F0] border-[#4A5568]/20",
  };

  const getStatusColor = (status: string) => STATUS_COLORS[status] || STATUS_COLORS["PENDING"];

  return (
    <div className="flex-1 flex flex-col items-center py-16 px-6 relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-bg-deep-graphite pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-20 reliance-field pointer-events-none"></div>

      <div className="w-full max-w-6xl relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        
        {/* Evidence Verification Header */}
        <div className={`p-8 border ${isSameEvidence ? 'bg-[#E6F4EA] border-[#005530]/20 text-[#005530]' : 'bg-[#FEE7EA] border-[#800010]/20 text-[#800010]'} shadow-sm`}>
          <div className="flex items-center gap-4 mb-4 border-b border-current/20 pb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSameEvidence ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              )}
            </svg>
            <h2 className="text-xl font-mono tracking-widest font-bold">
              {isSameEvidence ? "SAME EVIDENCE VERIFIED" : "EVIDENCE MISMATCH DETECTED"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Shared Source URL</div>
              <a href={leftData.evidence_ref} className="font-mono break-all hover:underline">{leftData.evidence_ref}</a>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">Shared Fingerprint (Keccak-256)</div>
              <div className="font-mono break-all font-bold opacity-90">{leftData.expected_hash}</div>
            </div>
            <div>
              <div className="mb-1 font-mono text-xs uppercase">Shared requirements</div>
              <div className="font-mono">{JSON.stringify(leftData.requirements)} — {sameRequirements ? "MATCH" : "DIFFER"}</div>
            </div>
            <div>
              <div className="mb-1 font-mono text-xs uppercase">Bradbury · Chain 4221</div>
              <div className="break-all font-mono">{FINAL_PROOF.contractAddress}</div>
            </div>
          </div>
        </div>

        {/* Comparison Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Branch */}
          <div className="bg-white shadow-xl border border-rules-light flex flex-col text-text-dark">
            <div className="p-6 border-b border-rules-light bg-surface-pale-gray">
              <div className="text-[10px] font-mono text-text-dark-secondary tracking-widest uppercase mb-1">{leftData.risk_level} Reliance Context</div>
              <div className="font-mono text-xs opacity-50 break-all"><Link href={`/warrant/${leftData.id}`} className="hover:underline">{leftData.id}</Link></div>
            </div>
            <div className="p-8 flex-1 space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-2 mb-3 font-semibold">Intended Action</div>
                <div className="font-medium text-[#0A0E17] leading-relaxed">{leftData.purpose}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-2 mb-3 font-semibold">Risk Level</div>
                <div className="font-bold tracking-wider">{leftData.risk_level}</div>
              </div>
            </div>
            <div className={`p-8 border-t flex flex-col items-center justify-center py-12 ${getStatusColor(leftData.status)}`}>
              <div className="text-[10px] font-mono tracking-widest uppercase mb-2 opacity-70">Semantic Verdict</div>
              <div className="text-3xl font-bold tracking-tight">{leftData.status}</div>
            </div>
          </div>

          {/* Right Branch */}
          <div className="bg-white shadow-xl border border-rules-light flex flex-col text-text-dark">
            <div className="p-6 border-b border-rules-light bg-surface-pale-gray">
              <div className="text-[10px] font-mono text-text-dark-secondary tracking-widest uppercase mb-1">{rightData.risk_level} Reliance Context</div>
              <div className="font-mono text-xs opacity-50 break-all"><Link href={`/warrant/${rightData.id}`} className="hover:underline">{rightData.id}</Link></div>
            </div>
            <div className="p-8 flex-1 space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-2 mb-3 font-semibold">Intended Action</div>
                <div className="font-medium text-[#0A0E17] leading-relaxed">{rightData.purpose}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5568] border-b border-[#0A0E17]/10 pb-2 mb-3 font-semibold">Risk Level</div>
                <div className="font-bold tracking-wider">{rightData.risk_level}</div>
              </div>
            </div>
            <div className={`p-8 border-t flex flex-col items-center justify-center py-12 ${getStatusColor(rightData.status)}`}>
              <div className="text-[10px] font-mono tracking-widest uppercase mb-2 opacity-70">Semantic Verdict</div>
              <div className="text-3xl font-bold tracking-tight">{rightData.status}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
