"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateWarrant() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate transaction delay
    setTimeout(() => {
      router.push("/warrant/pending-demo");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 w-full">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Prepare Reliance Warrant</h1>
        <p className="text-text-secondary leading-relaxed">
          Submit evidence and intended action for GenLayer consensus evaluation. 
          The network will determine if the evidence is sufficient for the declared risk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 border-t border-rules pt-10">
        
        {/* Evidence Section */}
        <div className="space-y-6 border-b border-rules pb-10">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-text-primary text-background text-xs font-mono">1</span>
            Evidence Source
          </h2>
          <div className="grid gap-2">
            <label htmlFor="evidenceUrl" className="text-sm font-medium uppercase tracking-wider text-text-secondary">Evidence URL</label>
            <input 
              id="evidenceUrl"
              type="url" 
              required
              className="w-full border border-rules bg-surface px-4 py-3 font-mono text-sm focus:outline-none focus:border-text-primary transition-colors placeholder:text-text-secondary/50"
              placeholder="https://example.com/report.json"
            />
            <p className="text-xs text-text-secondary mt-1">Must be publicly accessible for network validation.</p>
          </div>
        </div>

        {/* Action & Risk Section */}
        <div className="space-y-6 border-b border-rules pb-10">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-text-primary text-background text-xs font-mono">2</span>
            Context & Consequence
          </h2>
          
          <div className="grid gap-2">
            <label htmlFor="action" className="text-sm font-medium uppercase tracking-wider text-text-secondary">Intended Action</label>
            <textarea 
              id="action"
              required
              rows={3}
              className="w-full border border-rules bg-surface px-4 py-3 text-sm focus:outline-none focus:border-text-primary transition-colors placeholder:text-text-secondary/50 resize-y"
              placeholder="e.g. Execute an autonomous trade of 50 WETH based on this intelligence report."
            />
          </div>

          <div className="grid gap-4 mt-6">
            <label className="text-sm font-medium uppercase tracking-wider text-text-secondary">Risk Consequence</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['LOW', 'MEDIUM', 'HIGH'].map((risk) => (
                <label key={risk} className="relative flex cursor-pointer rounded-sm border border-rules bg-surface p-4 shadow-sm focus:outline-none hover:bg-background has-[:checked]:border-text-primaryhas-[:checked]:ring-1 has-[:checked]:ring-text-primary transition-all">
                  <input type="radio" name="riskLevel" value={risk} className="sr-only" defaultChecked={risk === 'MEDIUM'} />
                  <span className="flex flex-col">
                    <span className="block text-sm font-semibold">{risk}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-6 border-b border-rules pb-10">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-text-primary text-background text-xs font-mono">3</span>
            Validation Requirements
          </h2>
          <div className="grid gap-2">
            <label htmlFor="requirements" className="text-sm font-medium uppercase tracking-wider text-text-secondary">Specific Criteria (Optional)</label>
            <textarea 
              id="requirements"
              rows={2}
              className="w-full border border-rules bg-surface px-4 py-3 text-sm focus:outline-none focus:border-text-primary transition-colors placeholder:text-text-secondary/50 resize-y"
              placeholder="e.g. Must be published within the last 24 hours. Must mention NVDA."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-4 bg-text-primary text-background font-semibold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-background/30 border-t-background rounded-full"></span>
                <span>Awaiting Consensus...</span>
              </>
            ) : (
              "Submit for Adjudication"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
