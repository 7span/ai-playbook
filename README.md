# 7span/skills

A repository of agent skills designed to guide AI coding agents (such as Claude Code, Cursor, Codex, OpenCode, and more) in following specific technology standards and conventions.

## Install a Skill

To install skills from this repository, run:

```bash
npx skills add 7span/skills
```

## Use a Skill Without Installing

You can generate a prompt for a single skill or start a supported coding agent interactively without permanent installation:

```bash
npx skills use 7span/skills@nextjs | claude
npx skills use 7span/skills --skill nextjs --agent claude-code
```

## Source Formats

You can target this repository or specific subdirectories using various formats:

```bash
# GitHub shorthand (owner/repo)
npx skills add 7span/skills

# Full GitHub URL
npx skills add https://github.com/7span/skills

# Direct path to a specific skill in this repo
npx skills add https://github.com/7span/skills/tree/main/skills/nextjs

# Local path (useful for testing or local development)
npx skills add ./skills
```

## Options

| Option                    | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `-g, --global`            | Install to user directory instead of the project                                      |
| `-a, --agent <agents...>` | Target specific agents (e.g., `claude-code`, `cursor`, `opencode`).                   |
| `-s, --skill <skills...>` | Install specific skills by name (use `'*'` for all skills)                            |
| `-l, --list`              | List available skills without installing                                              |
| `--copy`                  | Copy files instead of symlinking to agent directories                                 |
| `-y, --yes`               | Skip all confirmation prompts                                                         |
| `--all`                   | Install all skills to all agents without prompts                                      |

## Examples

```bash
# List skills available in this repository
npx skills add 7span/skills --list

# Install specific skills
npx skills add 7span/skills --skill nextjs --skill reactjs-engineering-standards

# Install to specific agents
npx skills add 7span/skills -a claude-code -a cursor

# Non-interactive installation (ideal for CI/CD or setup scripts)
npx skills add 7span/skills --skill nextjs -g -a claude-code -y

# Install all skills from this repository to all agents
npx skills add 7span/skills --all
```

## Installation Scope & Methods

### Installation Scope

| Scope       | Flag      | Location            | Use Case                                      |
| ----------- | --------- | ------------------- | --------------------------------------------- |
| **Project** | (default) | `./<agent>/skills/` | Committed with your project, shared with team |
| **Global**  | `-g`      | `~/<agent>/skills/` | Available across all local projects           |

### Installation Methods

* **Symlink** (Recommended): Creates symlinks from each agent's configuration directory to a canonical copy. Offers a single source of truth and easy updates.
* **Copy**: Creates independent copies for each agent. Use when symlinks are not supported on your operating system.
