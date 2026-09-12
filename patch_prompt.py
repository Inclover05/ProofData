with open("contracts/reliance_warrant.py", "r") as f:
    text = f.read()

text = text.replace("Evaluate whether the EVIDENCE is sufficient", "Evaluate the following evidence is sufficient")

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(text)
