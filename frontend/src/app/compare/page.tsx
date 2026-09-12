import Link from "next/link";

export default function ComparePage() {
  const sharedEvidence = {
    url: "https://api.example.com/market-report/v2",
    hash: "0x8f7d9a1b2c3d4e5f6g7h8i9j0k1l2m3n"
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 w-full flex flex-col items-center">
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Reliance Compare</h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          The exact same evidence evaluated against two different intended actions. Provenance is constant; purpose dictates validity.
        </p>
      </div>

      {/* Shared Evidence Node */}
      <div className="w-full max-w-2xl bg-surface border border-rules shadow-sm p-6 mb-8 relative z-10 text-center">
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-4">Constant: Source Evidence</h2>
        <div className="inline-flex flex-col items-center gap-2">
          <span className="text-sm font-mono bg-background border border-rules px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
            {sharedEvidence.hash}
          </span>
          <a href={sharedEvidence.url} className="text-xs text-accent hover:underline font-mono">{sharedEvidence.url}</a>
        </div>
      </div>

      {/* Bifurcation Lines (Hidden on small mobile) */}
      <div className="hidden md:flex w-full max-w-4xl justify-center h-16 relative -mt-8 mb-4">
        <div className="w-1/2 border-t border-l border-rules rounded-tl-xl relative top-8 left-[25%] h-8"></div>
        <div className="w-1/2 border-t border-r border-rules rounded-tr-xl relative top-8 right-[25%] h-8"></div>
      </div>

      {/* Comparison Columns */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
        
        {/* Left Column: Low Consequence */}
        <div className="bg-surface border border-rules shadow-sm flex flex-col h-full">
          <div className="p-8 border-b border-rules">
            <h3 className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-2">Variable: Purpose A</h3>
            <p className="text-lg font-medium leading-snug">Include findings in internal weekly research summary.</p>
            <div className="mt-4 inline-block px-2 py-1 bg-background border border-rules text-xs font-semibold uppercase tracking-wider">Risk: LOW</div>
          </div>
          
          <div className="p-8 bg-[#E3F5EA] flex-1 flex flex-col justify-center items-center text-center border-t border-[#005924]/20">
            <div className="text-4xl font-bold tracking-tight text-[#005924] mb-4">WARRANTED</div>
            <p className="text-sm text-[#005924]/80 max-w-sm">
              Evidence is sufficient for LOW risk research purposes. Source is a known analytical endpoint and contents are internally consistent.
            </p>
            <Link href="/warrant/demo-low" className="mt-6 text-xs font-mono font-semibold uppercase tracking-widest text-[#005924] hover:underline">View Dossier →</Link>
          </div>
        </div>

        {/* Right Column: High Consequence */}
        <div className="bg-surface border border-rules shadow-sm flex flex-col h-full">
          <div className="p-8 border-b border-rules">
            <h3 className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-2">Variable: Purpose B</h3>
            <p className="text-lg font-medium leading-snug">Execute an autonomous trade of 50 WETH based on this intelligence report.</p>
            <div className="mt-4 inline-block px-2 py-1 bg-background border border-rules text-xs font-semibold uppercase tracking-wider">Risk: HIGH</div>
          </div>
          
          <div className="p-8 bg-[#FEE7EA] flex-1 flex flex-col justify-center items-center text-center border-t border-[#8A0012]/20">
            <div className="text-4xl font-bold tracking-tight text-[#8A0012] mb-4">NOT WARRANTED</div>
            <p className="text-sm text-[#8A0012]/80 max-w-sm">
              Evidence is insufficient for a HIGH risk action. Lacks cryptographic signatures and contains probabilistic language unsuitable for autonomous execution.
            </p>
            <Link href="/warrant/demo" className="mt-6 text-xs font-mono font-semibold uppercase tracking-widest text-[#8A0012] hover:underline">View Dossier →</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
