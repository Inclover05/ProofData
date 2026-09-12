---
name: write-contract
description: Write GenLayer intelligent contracts. Covers equivalence principles, storage rules, LLM resilience.
---

# Write Intelligent Contract

Guidance for writing GenLayer intelligent contracts that pass consensus, handle errors correctly, and survive production.

**PROJECT SPECIFIC RULES:**
- **Beginner Teaching**: Explain what the code does, why it's needed, what files change, and how the user can verify the result BEFORE writing it.
- **No Product Code During Milestone 0**: Do not implement ProofData product code yet.
- **No Silent Architecture Changes**: Explain architectural decisions.

## Critical: Pin the Runner Version
All GenLayer networks reject `py-genlayer:test`, `py-genlayer:latest`, and unversioned aliases. Every contract MUST start with a pinned runner dependency header:
```python
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
```
Always verify there is no `test` or `latest` alias before saving a contract.

## Equivalence Principle
Pick the right principle for consensus:
1. **strict_eq**: Exact match. Use for deterministic calls (e.g., blockchain RPC, stable REST APIs). Never use for LLM calls.
2. **Custom Validator (run_nondet_unsafe)**: Default for LLMs/Web. Rerun the same task and compare decision fields with explicit tolerances.
3. **prompt_comparative / prompt_non_comparative**: Convenience wrappers. Prefer custom validators for production.

## Error Classification
Classify errors so validators know how to compare them:
```python
ERROR_EXPECTED  = "[EXPECTED]"   # Business logic (deterministic) — exact match required
ERROR_EXTERNAL  = "[EXTERNAL]"   # External API 4xx (deterministic) — exact match required
ERROR_TRANSIENT = "[TRANSIENT]"  # Network/5xx (non-deterministic) — agree if both transient
ERROR_LLM       = "[LLM_ERROR]"  # LLM misbehavior — always disagree, force rotation
```

## Storage Rules
- Use `TreeMap[K, V]` instead of `dict`.
- Use `DynArray[T]` instead of `list`.
- Use `u256` or `i256` for large ints/money.
- Storage fields are **class-level type annotations**, not initialized in `__init__`! (e.g., `owner: Address`)
- Append new fields at END only.

## LLM Resilience
Always defensively parse LLM outputs. Always use `response_format="json"`. Do not assume JSON is clean; sanitize it.
