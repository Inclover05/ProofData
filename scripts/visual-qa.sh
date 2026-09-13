#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <milestone>"
  exit 1
fi

MILESTONE=$1
OUTDIR="docs/visual-reviews/$MILESTONE"
mkdir -p "$OUTDIR"

ROUTES=("/" "/create" "/warrant/warrant-cb5653e5-76f4-4dcd-9ae4-d22f81786fea" "/warrant/warrant-c955c636-7f66-4350-89b9-932f4ecd1451" "/compare")
NAMES=("home" "create" "warrant-low" "warrant-high" "compare")

# Create a skeleton VISUAL_REVIEW.md
REVIEW_FILE="$OUTDIR/VISUAL_REVIEW.md"
echo "# Visual Review: $MILESTONE" > "$REVIEW_FILE"
echo "" >> "$REVIEW_FILE"

for i in "${!ROUTES[@]}"; do
  ROUTE="${ROUTES[$i]}"
  NAME="${NAMES[$i]}"
  URL="http://localhost:3000$ROUTE"
  
  echo "====================================="
  echo "Capturing $NAME ($ROUTE)"
  echo "====================================="

  # --- DESKTOP ---
  echo "-> Desktop (1440x1000)"
  npx playwright-cli open "$URL"
  npx playwright-cli resize 1440 1000
  npx playwright-cli screenshot --filename="$OUTDIR/$NAME-desktop.png"
  npx playwright-cli snapshot --filename="$OUTDIR/$NAME-desktop-snapshot.yml"
  npx playwright-cli console > "$OUTDIR/$NAME-desktop-console.txt"
  npx playwright-cli eval "() => { const els = [...document.querySelectorAll('*')]; return els.filter(e => e.scrollWidth > e.clientWidth).map(e => e.tagName + (e.id ? '#'+e.id : '') + (e.className ? '.'+e.className.split(' ').join('.') : '')).join(', ') }" > "$OUTDIR/$NAME-desktop-overflow.txt"
  npx playwright-cli close

  # --- MOBILE ---
  echo "-> Mobile (390x844)"
  # We use generic mobile emulation if we can, or just resize
  npx playwright-cli open "$URL" --mobile
  npx playwright-cli resize 390 844
  npx playwright-cli screenshot --filename="$OUTDIR/$NAME-mobile.png"
  npx playwright-cli snapshot --filename="$OUTDIR/$NAME-mobile-snapshot.yml"
  npx playwright-cli console > "$OUTDIR/$NAME-mobile-console.txt"
  npx playwright-cli eval "() => { const els = [...document.querySelectorAll('*')]; return els.filter(e => e.scrollWidth > e.clientWidth).map(e => e.tagName + (e.id ? '#'+e.id : '') + (e.className ? '.'+e.className.split(' ').join('.') : '')).join(', ') }" > "$OUTDIR/$NAME-mobile-overflow.txt"
  npx playwright-cli close

  # Add section to VISUAL_REVIEW.md
  cat <<EOF >> "$REVIEW_FILE"
## Route: $ROUTE

### Desktop (1440x1000)
- **Visual hierarchy:** 
- **Spacing:** 
- **Typography:** 
- **Contrast:** 
- **Glass usage:** 
- **Responsiveness:** 
- **Overflow/clipping:** 
- **Accessibility observations:** 
- **Remaining visual weaknesses:** 
- **Console errors:** 
- **PASS/FAIL:** 

### Mobile (390x844)
- **Visual hierarchy:** 
- **Spacing:** 
- **Typography:** 
- **Contrast:** 
- **Glass usage:** 
- **Responsiveness:** 
- **Overflow/clipping:** 
- **Accessibility observations:** 
- **Remaining visual weaknesses:** 
- **Console errors:** 
- **PASS/FAIL:** 

---
EOF

done

echo "Done capturing. Review the files in $OUTDIR, fill in $REVIEW_FILE, then zip the folder."
