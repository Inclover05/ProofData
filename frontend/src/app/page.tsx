import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background Reliance Field */}
      <div className="absolute inset-0 z-0 opacity-40 reliance-field pointer-events-none"></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1a2f6c] rounded-full blur-[200px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Evidence is not <br /> enough without <br /> a <span className="text-accent glow-text">purpose</span>.
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed font-light">
            ProofData evaluates whether exact evidence is sufficient to rely on for a specific intended action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href="/create" className="inline-flex items-center justify-center px-8 py-4 bg-surface text-text-dark font-medium hover:bg-opacity-90 transition-all rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Create Reliance Warrant
            </Link>
            <Link href="/compare" className="inline-flex items-center justify-center px-8 py-4 border border-rules text-text-primary hover:bg-rules transition-colors rounded-sm premium-glass">
              Compare Same Evidence
            </Link>
          </div>
        </div>
        
        <div className="md:col-span-5 hidden md:flex justify-end animate-in fade-in slide-in-from-right-8 duration-700 delay-200 ease-out fill-mode-both">
          <div className="bg-surface-ivory text-text-dark p-6 max-w-sm relative w-full shadow-2xl flex flex-col gap-4 border border-rules-light before:absolute before:inset-0 before:bg-black/5 before:opacity-[0.03] before:pointer-events-none">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-px text-rules-light/50"><line x1="0" y1="0" x2="48" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" /></div>
            
            <div className="flex justify-between items-center border-b border-rules-light pb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-dark-secondary font-mono">Reliance Warrant</span>
              <span className="text-[10px] bg-verdict-warranted-bg text-verdict-warranted-text px-2 py-1 uppercase font-mono tracking-wider font-semibold">Warranted</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-text-dark-secondary mb-1">Evidence Fingerprint</div>
                <div className="font-mono text-xs truncate bg-surface-pale-gray p-2 border border-rules-light text-text-dark flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  0x8f7d9a1c...2b4ce7
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-text-dark-secondary mb-1">Purpose</div>
                  <div className="text-sm font-medium">Trade Exec</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-text-dark-secondary mb-1">Consequence</div>
                  <div className="text-sm font-medium text-accent">High Risk</div>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-rules-light mt-2 flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-wider text-accent font-mono font-semibold">Action Authorized</div>
              <div className="w-4 h-4 rounded-full border border-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="border-t border-rules bg-bg-cool-slate relative z-10 mt-auto backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 flex flex-col">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-accent font-mono mb-4">Protocol Integration</h2>
            <h3 className="text-3xl font-light tracking-tight text-white mb-6">Programmatic <br/>Reliance</h3>
            <p className="text-text-secondary leading-relaxed max-w-sm">
              Query Reliance Warrants directly from your autonomous agent or application before executing consequential actions. 
            </p>
            
            <div className="mt-12 hidden sm:flex items-center gap-3 text-xs font-mono text-text-secondary">
              <div className="px-3 py-2 border border-rules bg-bg-midnight-navy">Evidence</div>
              <div className="text-rules">→</div>
              <div className="px-3 py-2 border border-accent/30 text-accent bg-accent/5">Warrant</div>
              <div className="text-rules">→</div>
              <div className="px-3 py-2 border border-rules bg-bg-midnight-navy text-white">Action</div>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="bg-bg-midnight-navy border border-rules p-8 font-mono text-sm shadow-2xl overflow-hidden relative">
              <div className="flex gap-2 mb-6 border-b border-rules pb-4">
                <div className="w-2 h-2 rounded-full bg-rules"></div>
                <div className="w-2 h-2 rounded-full bg-rules"></div>
                <div className="w-2 h-2 rounded-full bg-rules"></div>
              </div>
              <pre className="text-text-primary/90 overflow-x-auto relative z-10">
<span className="text-accent">const</span> w = <span className="text-accent">await</span> contract.get_warrant(<span className="text-emerald-400">&quot;wd_7f2b9&quot;</span>);

<span className="text-accent">if</span> (w.status === <span className="text-emerald-400">&quot;WARRANTED&quot;</span>) {"{"}
  <span className="text-text-secondary">{"// Consequence constraint met"}</span>
  <span className="text-accent">await</span> executeTrade(w.evidence);
{"}"} <span className="text-accent">else</span> {"{"}
  abortTrade(<span className="text-emerald-400">&quot;Evidence insufficient for risk level&quot;</span>);
{"}"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
