# UI Design Direction: ProofData

## Overall Visual Concept
**Forensic Liquid Editorial.** 
ProofData combines forensic evidence review, institutional financial research seriousness, and Swiss/editorial composition. It utilizes a document/warrant semantics approach overlaid with futuristic but restrained translucent materials (selective liquid-glass depth), evidence fingerprints, and visible GenLayer consensus boundaries. It projects precision, credibility, and premium technical calmness. It intentionally rejects generic SaaS, generic crypto/DeFi, neon cyberpunk, or overused glassmorphism aesthetics.

## Typography Philosophy & Hierarchy
Typography carries the personality of the page.
- **Display/Hero**: Oversized editorial typography that makes a bold, authoritative statement. Used for verdicts, major page titles, and atmospheric hero headers.
- **Primary Body**: Clean, highly legible sans-serif for rigorous reading (e.g., Inter, Helvetica Now) set with optimal line lengths (<80 chars) and generous line height.
- **Technical/Metadata**: Monospace font (e.g., JetBrains Mono, Fira Code) used strictly for Evidence Fingerprints, Hashes, Contract Addresses, and Timestamps to emphasize structural integrity and machine verification.
- **Rules**: Avoid all-caps for labels; use active voice and sentence case. No unnecessary typographic labels above content.

## Grid & Layout Philosophy
- **Modular Grid**: Strict, underlying Swiss-style modular grid to organize complex information predictably.
- **Asymmetry**: Deliberate asymmetry for visual interest and dynamic tension, avoiding cookie-cutter symmetrical cards.
- **Whitespace**: Generous negative space that allows technical data to breathe and reduces cognitive load.
- **Metadata Rails**: Left or right rails to hold secondary information (timestamps, hashes) without cluttering the main reading flow.
- **Structure**: Information is structured like a document or printed report, avoiding the generic "SaaS card kit" look.

## Spacing Rhythm
- **Macro Spacing**: Large margins and padding between major structural sections to convey calmness and premium quality.
- **Micro Spacing**: Tight, deliberate spacing between related metadata elements (e.g., hash and copy button) to group them visually.

## Surface Hierarchy & Glass Budget
Glass is a material, not the entire identity.
**Allowed Glass (The Budget):**
- Navigation surfaces (headers/menus).
- Evidence inspection overlays and contextual panels.
- Active process / GenLayer consensus state overlays.
- Selected depth in the Homepage Hero section.

**Prohibited Glass:**
- The main Reliance Warrant dossier body. It must remain opaque, highly readable, and feel like an authoritative physical document.
- Dense text areas where transparency harms accessibility.

**Glass Execution:**
Subtle backdrop blur, restrained transparency, fine hairline edges, faint internal highlights, soft depth, controlled noise/grain, and excellent text contrast.

## Border & Rule Language
- **Structural Rules**: Use thin, crisp lines (hairlines, black or highly contrasted rules) to delineate sections, taking inspiration from financial broadsheets and Swiss grids.
- **Borders**: Sharp corners or extremely minimal rounding (e.g., 2px). Do not use uniform heavy border-radii everywhere.

## Evidence Fingerprint Treatment
Evidence Fingerprints (hashes, IDs) must feel like secure cryptographic anchors. They should be styled distinctly—using monospace fonts, subtle background tints, or a "fingerprint/lock" semantic icon. They should feel intractable and absolute.

## Reliance Warrant Dossier Treatment
The Warrant is the core primitive. It should visually resemble a bound certificate, a technical readout box, or an institutional research report. Solid borders, crisp padding, clear key-value pairs (Purpose, Risk, Status), opaque background, and a dominant display of the verdict.

## Verdict Treatments (The Four States)
Verdict colors must tie directly to meaning and readability, passing WCAG contrast rules.
1. **WARRANTED**: Dark, authoritative Forest Green. Signals safety and authorization.
2. **CONDITIONAL**: Deep Amber / Warning Orange. Signals "proceed with caution" or manual review needed.
3. **NOT_WARRANTED**: Crimson / Stamped Red. Strict, undeniable rejection.
4. **INCONCLUSIVE**: Slate / Cool Gray. Neutral, unresolved, missing evidence.
*Design execution must include borders, stamp-like typography, and icons so status is not conveyed by color alone.*

## Icons
Utilitarian, sharp, and consistent. Used only when necessary to convey status (checks, crosses, warning triangles) or actions (copy, external link). No decorative or illustrative icons.

## Consensus & Loading States
- **Loading**: Technical terminal-like loading ("Awaiting GenLayer Consensus [///...]") rather than generic spinning circles.
- **State Changes**: Progress should feel like a machine grinding through evidence, updating step-by-step.

## Motion Philosophy
Use motion only for meaning (Emotion, Visual Narrative, Motion Craft).
- **Personality**: "Corporate" (clean, professional, 200-400ms) for UI; "Premium" (elegant, 350-600ms) for page reveals.
- **Allowed Uses**: Evidence moving into evaluation, consensus state transitions, warrant status stamp appearing, progressive document reveals.
- **Prohibited**: Gratuitous floating, endless looping decorations, parallax everywhere, exaggerated spring motion.

## Mobile & Responsiveness
- **Execution**: Quality floor includes flawless mobile responsiveness.
- **GPU Considerations**: Glass effects must gracefully degrade to opaque fallbacks on mobile to ensure fast rendering and save battery life.

## Accessibility (a11y)
- **Contrast**: Grade AA (WCAG 2.1) minimum for all text. Opaque fallbacks where glass reduces readability.
- **Focus**: Visible, sharp keyboard focus indicators (e.g., a 2px high-contrast outline).
- **Color Independence**: Never rely on color alone for critical information (e.g., use shapes and text for Verdicts).

## Reduced-Motion Behavior
- Respect `prefers-reduced-motion` media queries. Disable all non-essential transitions, replacing sliding/fading with instant state changes or very fast opacity crossfades.

## Anti-Patterns
- Generic SaaS rounding and identical cards.
- Glowing purple/pink AI gradients.
- Neon cyberpunk elements.
- Parallax everywhere.
- Indiscriminate use of glassmorphism on reading surfaces.

---

## DESIGN SYSTEM V1 (P1.6 Material Hierarchy)

### Semantic Tokens

#### Foundation
- `color-bg-dark-slate`: `#050810` (Deep atmosphere)
- `color-bg-deep-graphite`: `#0a0e17` (Protocol metadata surface)
- `color-bg-midnight-navy`: `#0d121f` (Atmosphere / deep structure)
- `color-bg-cool-slate`: `#151a28` (Calmer institutional slate / Evidence surface)
- `color-surface-ivory`: `#FDFDFD` (Opaque paper/document material for Reliance Dossiers)
- `color-surface-pale-gray`: `#F5F7FA` (Slightly differentiated institutional surface)
- `color-text-primary`: `#F0F4F8` (For dark surfaces)
- `color-text-secondary`: `#8E9BB0`
- `color-text-dark`: `#0A0E17` (For light dossier surfaces)
- `color-text-dark-secondary`: `#4A5568`
- `color-rules`: `rgba(255, 255, 255, 0.08)` (Dark surfaces)
- `color-rules-light`: `rgba(0, 0, 0, 0.1)` (Light surfaces)
- `color-accent`: `#2B5CFF` (Restrained cobalt)

#### Verdict Semantics (Foreground / Background pairs)
- `color-verdict-warranted-text`: `#004D20`
- `color-verdict-warranted-bg`: `#E3F5EA`
- `color-verdict-conditional-text`: `#8A4600`
- `color-verdict-conditional-bg`: `#FFF0D4`
- `color-verdict-not-warranted-text`: `#800010`
- `color-verdict-not-warranted-bg`: `#FEE7EA`
- `color-verdict-inconclusive-text`: `#4A5568`
- `color-verdict-inconclusive-bg`: `#EDF2F7`
# Future Frontend Revamp (Post-Core)

## A. Interaction Bubble / Liquid Hover Lens
On pointer-capable desktop devices:
- When the pointer hovers an interactive target (buttons, navigation links, wallet choices, cards), it gains a soft, premium interaction bubble/lens.
- Desired feeling: pointer approaches target -> subtle translucent bubble expands around the interactive area -> target becomes unmistakably active -> on mouse-down/click the bubble gently compresses -> on release it settles back.
- Purpose: Communicates "this is clickable" and "your pointer is currently over this control".
- Implementation guidelines: Do NOT make every static element react, do NOT obscure text, do NOT create a distracting custom cursor gimmick. Prefer CSS pseudo-elements, small scale transforms, subtle border/refraction effects, controlled blur, or soft highlight. Performance must remain lightweight.
- Respect `prefers-reduced-motion`.
- Touch devices: Do NOT emulate hover. Use proper pressed/focus states instead.
- Keyboard focus: Must receive an equally clear visual affordance.

## B. Color / Atmosphere Revamp
The current frontend is considered too plain and uniformly dark. 
The future visual pass will introduce more emotional depth while preserving institutional trust.
- Avoid: rainbow Web3, cyberpunk, NFT neon, generic gradient SaaS.
- Explore: A richer restrained system around deep graphite / midnight, luminous cobalt, cool blue, controlled cyan/teal depth, warm ivory/document material, subtle atmospheric gradients, and semantic verdict colors.
- Route Character:
  - HOME: most atmospheric and memorable
  - CREATE: premium technical workspace
  - WARRANT: authoritative document/dossier
  - COMPARE: high-impact analytical field
- The site should feel premium, alive, futuristic, trustworthy, interactive.

## C. Frontend Revamp Timing
Do NOT start this redesign until the core flow is proven:
1. wallet connection
2. real write
3. transaction lifecycle
4. finalized warrant read
