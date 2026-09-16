# ProofData frontend

Next.js App Router product for the final Bradbury Testnet contract. Start with the [root README](../README.md) for the thesis, deployment, proof bundle and demo.

From this directory, with Node.js 24 and npm:

```bash
npm ci
npm run dev -- --webpack -p 3035
```

Production and checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- -p 3035
```

Routes: `/`, `/create`, `/warrant/[id]`, `/compare`. Reads need no wallet. Writes use the selected EIP-6963 provider on Bradbury chain 4221. [BRADBURY_CONFIGURATION.md](BRADBURY_CONFIGURATION.md) explains the public configuration and scoped gas adapter. No secret environment values are needed for the public demo configuration.
