# Contributing to the 7Span AI Playbook

Anyone at 7Span can contribute. Stack champions review and merge.

## Governance model

- Each stack folder has a **champion** listed in [`CODEOWNERS.md`](CODEOWNERS.md). Champions approve PRs touching their folder.
- Repo-wide files (root `README.md`, this file, `.github/`) require CTO office approval.
- Champions review their entire folder once per quarter and bump the `last-verified` date. Files past two quarters get a stale banner until re-verified.

## What to contribute

1. **Guidelines**: conventions, prompt patterns, and workflows that worked on real projects.
2. **Skills**: reusable SKILL.md packages following the [Agent Skills standard](https://agentskills.io/specification).
3. **AGENTS.md / CLAUDE.md improvements** for your stack.
4. **Learning resources**: vetted external videos and articles, added to your stack's README with a one-line note on why it is worth someone's time.

## Contribution flow

1. Open an issue describing what you want to add or change, which folder it belongs to, and which real project it was tested on. One paragraph is enough.
2. The folder's champion gives a quick yes, no, or reshape within 3 working days.
3. Open a PR. GitHub pre-fills the description from our [PR template](.github/PULL_REQUEST_TEMPLATE.md); fill in every section.
4. Champion reviews against the quality bar below and merges.

## Quality bar (definition of done for a contribution)

- [ ] Battle-tested on at least one real project, named in the PR description.
- [ ] Frontmatter includes a `last-verified` date and an owner.
- [ ] Guideline files stay under 150 lines. Push depth into linked reference docs.
- [ ] No client names, client code, or client data.
- [ ] Skills follow the Agent Skills standard: `name` matches the folder name, SKILL.md under 500 lines, extras in `scripts/`, `references/`, or `assets/`. Tested with Claude Code on a real task.
- [ ] External links checked and annotated (what it is, why it is useful, how long it takes).

## Writing rules

- Command-first. Show the exact command or prompt before the prose explaining it.
- Write for a mid-level engineer new to AI tooling, not for yourself.
- Prefer one great example over three mediocre ones.
