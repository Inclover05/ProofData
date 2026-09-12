with open("docs/MILESTONES.md", "r") as f:
    text = f.read()

text = text.replace("STATUS: PASS", "STATUS: VERIFIED")
text = text.replace("M0 — Environment validation\nSTATUS: VERIFIED", "M0 — Environment validation\nSTATUS: PASS")
text = text.replace("M11 — Freeze feasibility architecture\nSTATUS: VERIFIED", "M11 — Freeze feasibility architecture\nSTATUS: PASS")

with open("docs/MILESTONES.md", "w") as f:
    f.write(text)
