# 7Span AI Playbook

How 7Span ships software with AI. One repository for guidelines, drop-in agent configs, and skills across every stack we work with.

## How to use this repo

1. Find your stack under [`stacks/`](stacks/).
2. Copy its `AGENTS.md` and `CLAUDE.md` into your project root, then fill in the TODO markers.
3. Copy any skills you need from `stacks/<your-stack>/skills/` into your project's `.claude/skills/`.

## Repository map

```
ai-playbook/
└── stacks/                One folder per technology stack
    └── <stack>/
        ├── README.md      Rationale, usage, stack learning resources
        ├── AGENTS.md      Drop-in agent rules (self-contained, tool agnostic)
        ├── CLAUDE.md      Thin bridge for Claude Code (imports AGENTS.md)
        └── skills/        Stack-owned skills (SKILL.md format)
```

More stacks, docs, and templates will be added as they are battle-tested.

## Principles

1. **Stack folders are self-contained.** Everything a team needs lives in `stacks/<stack>/`. No repo-wide rule files to merge or reconcile.
2. **Open standards, no lock-in.** AGENTS.md for rules (read natively by Cursor, Copilot, Codex, and others). Skills follow the [Agent Skills standard](https://agentskills.io).
3. **Exemplars over coverage.** A stack folder ships only when it is battle-tested on a real project. Empty is better than wrong.
4. **Freshness is enforced.** Every guideline carries a `last-verified` date, reviewed quarterly by its stack champion.

## Status

| Stack | Status |
|---|---|
| Laravel | In progress |
