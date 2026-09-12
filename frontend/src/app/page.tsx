import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background Grid Pattern for Technical Feel */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--rules-borders) 1px, transparent 1px), linear-gradient(90deg, var(--rules-borders) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>
      
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-8 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Evidence is not <br /> enough without <br /> a <span className="text-accent">purpose</span>.
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed">
            ProofData evaluates whether exact evidence is sufficient to rely on for a specific intended action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/create" className="inline-flex items-center justify-center px-6 py-3 bg-text-primary text-background font-medium rounded-sm hover:opacity-90 transition-opacity">
              Create Reliance Warrant
            </Link>
            <Link href="/compare" className="inline-flex items-center justify-center px-6 py-3 border border-rules bg-surface font-medium hover:bg-background transition-colors">
              Compare Same Evidence
            </Link>
          </div>
        </div>
        
        <div className="md:col-span-4 hidden md:block">
          <div className="bg-glass-surface backdrop-blur-xl border border-rules p-6 shadow-sm flex flex-col space-y-4">
            <div className="text-xs uppercase tracking-widest text-text-secondary font-mono border-b border-rules pb-2">Why Context Matters</div>
            <p className="text-sm leading-relaxed text-text-primary">
              The exact same evidence may safely support a <strong className="font-semibold">low-consequence research summary</strong>, but completely fail to authorize a <strong className="font-semibold">high-consequence autonomous action</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="border-t border-rules bg-surface relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Agent & Developer Integration</h2>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Query Reliance Warrants directly from your autonomous agent or application before executing consequential actions. 
            </p>
          </div>
          <div className="bg-background border border-rules p-6 overflow-x-auto font-mono text-sm shadow-inner">
            <pre className="text-text-primary">
{`const w = await contract.get_warrant("id_123");

if (w.status === "WARRANTED") {
  await executeTrade(w.evidence);
} else {
  abortTrade("Evidence insufficient for risk");
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
