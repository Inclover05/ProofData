with open("contracts/reliance_warrant.py", "r") as f:
    content = f.read()

content = content.replace("requirements=DynArray[str](requirements),", "requirements=DynArray[str](),")

with open("contracts/reliance_warrant.py", "w") as f:
    f.write(content)
