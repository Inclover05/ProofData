# Skill: Test Before Progress

Primary rule: **NO PASS → NO PROGRESS.**

A milestone is complete only when its expected observable result is reproduced and recorded.

## Required sequence
RESEARCH → EXPLAIN → IMPLEMENT → LINT → TEST → OBSERVE → DOCUMENT → CONTINUE

## Failure behavior
If a test fails:
- stop the milestone
- capture the exact error
- isolate the failure
- inspect current docs
- apply the smallest fix
- rerun the failed test

Do not continue to later milestones while a required earlier test is failing.
