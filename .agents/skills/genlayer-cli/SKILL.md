---
name: genlayer-cli
description: Use the GenLayer CLI to deploy, interact with, and debug intelligent contracts.
---

# GenLayer CLI

The `genlayer` CLI manages contract deployment, interaction, transaction inspection, and network configuration.

**PROJECT SPECIFIC RULES:**
- **Documentation-first**: Base CLI usage on these verified commands, do not guess APIs.
- **Beginner Teaching**: Explain what the command will do before executing it.

## Network Configuration
```bash
genlayer network set testnet-bradbury
genlayer network info
```
**Note:** Always use `genlayer network set` instead of `--rpc`.

## Account Management
```bash
genlayer account
genlayer account create --name dev1
genlayer account use dev1
```
StudioNet is gasless; 0 GEN balance is fine. For testnets, use the faucet.

## Contract Interaction
- **Deploy**: `genlayer deploy --contract contracts/my_contract.py`
- **Read**: `genlayer call <address> <method>`
- **Write**: `genlayer write <address> <method>`
- **Inspect**: `genlayer schema <address>`, `genlayer code <address>`

## Transaction Debugging
```bash
genlayer receipt <txHash> --stdout --stderr
genlayer receipt <txHash> --status FINALIZED
```

**CRITICAL: Lifecycle status is not execution success.**
`ACCEPTED` or `FINALIZED` does not mean the code executed without errors. If a deploy fails, check the execution result using `--stdout --stderr` on the receipt.

## Local Studio Management
- `genlayer init`
- `genlayer up` (Starts Studio, requires Docker)
- `genlayer stop`
