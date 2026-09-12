# ProofData — Learning Notes

## What I learned
- **Persistent State:** Data in a GenLayer contract doesn't disappear when the script ends. By declaring class-level fields, the network automatically saves and loads them.
- **TreeMap:** GenLayer's version of a dictionary. We used `TreeMap[str, RelianceWarrant]` to store our warrants by their ID string.
- **Storage Dataclass:** By attaching the `@allow_storage` decorator to a standard Python `@dataclass`, we tell GenLayer how to save a custom object structure to the persistent state.
- **Public View vs Write:** Methods that modify state (like `create_warrant`) must use `@gl.public.write`. Methods that just read data (like `get_warrant`) use `@gl.public.view`.
- **DynArray Initialization:** Even though a storage field must be typed as `DynArray[str]`, you cannot create it yourself with `DynArray()`. You simply pass a normal Python list `["req 1"]` when building the dataclass, and GenLayer converts it internally.
- **Reliance Warrant Representation:** We represented the core ProofData primitive by storing the evidence URL, purpose, risk level, a list of requirements, and an initial "PENDING" status.

## How this part of ProofData works (M1)
The intelligent contract `ProofDataRelianceLayer` exposes a `create_warrant` method. When a human or agent calls it with a unique ID and their requirements, the contract creates a `RelianceWarrant` object and saves it securely in the `warrants` TreeMap on the GenLayer network. Downstream systems can then read that exact warrant back using `get_warrant`.

## How we verified it
We used `genvm-lint` to prove the contract syntax followed all GenLayer SDK rules. Then we used Direct Mode tests (in-memory simulations) to deploy the contract, create a warrant, read it back to verify every field matched, and create multiple warrants to prove they stay independent in the database.

## FROM PROTOCOL TO PRODUCT
*(Added during M11 Product Planning)*

### What we proved
During the spike (M0-M10), we proved that the GenLayer network can reliably execute our Python `ProofDataRelianceLayer` smart contract. We proved that multiple decentralized validators can fetch an external URL, hash it to prove its identity, evaluate its contents using LLMs against a specific user-defined purpose, and securely reach a consensus on whether the evidence is `WARRANTED` or `NOT_WARRANTED`. We proved this works even against prompt injection attacks.

### Why a working contract is not yet a product
A smart contract is just backend infrastructure. Without a product, a user has to write Python scripts and use CLI tools just to interact with it. A product makes the complex protocol instantly understandable and accessible to non-technical users. 

### What GenLayerJS will do
`genlayer-js` is the bridge. It allows our web browser to talk to the GenLayer network. It reads the public data (like `get_warrant`) and formats the complex transaction requests (like `create_warrant`) so our browser wallet can sign them.

### What the frontend will do
The Next.js frontend is the visual translation layer. It takes the raw JSON data returned by GenLayerJS and renders it as the "Forensic Dossier". It handles the 15-second waiting periods by showing reassuring UI states, and it guides the user into understanding the value proposition through features like the side-by-side "Reliance Compare" screen.

### Why we are creating the PRD before coding
In a hackathon, time is the scarcest resource. If we start building UI components without a strict plan, we will waste hours building features that don't matter (like user profiles or complex dashboards). The PRD forces us to define the *absolute minimum* number of screens required to deliver the "Killer Demo," ensuring every line of code we write directly contributes to the final pitch.

## [Frontend P1 Notes - 2026-09-12]
- Using Tailwind CSS v4 with @theme inline directives simplifies design token generation directly in globals.css, avoiding tailwind.config.ts overhead.
- Next.js 15 App Router is extremely strict about 'use client' and static vs dynamic segments.
