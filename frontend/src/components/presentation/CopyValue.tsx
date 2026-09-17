"use client";

import { useState } from "react";

export function CopyValue({ value, label, href }: { value: string; label: string; href?: string }) {
  const [feedback, setFeedback] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(value); setFeedback("Copied"); }
    catch { setFeedback("Select the value to copy"); }
  }
  return <div className="identity-value">
    {href ? <a href={href} target="_blank" rel="noreferrer" className="technical-value">{value}</a> : <span className="technical-value">{value}</span>}
    <button type="button" className="copy-control" onClick={copy} aria-label={`Copy ${label}`} title={`Copy ${label}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></svg>
    </button>
    <span className="copy-feedback" role="status">{feedback}</span>
  </div>;
}
