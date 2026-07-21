# Contributing to 7span/skills

This guide explains the project architecture, how to add a new skill to the repository, and the validation steps required before pushing your changes to GitHub.

---

## Project Architecture

This repository is organized as a monorepo of agent skills. The directory structure is as follows:

```text
7span/skills/
├── skills/                  # Core directory containing all skill modules
│   ├── nextjs/              # Next.js skill module
│   │   ├── skill.md         # Main skill file with frontmatter and high-level rules
│   │   └── references/      # Detailed documentation for specific subtopics
│   ├── reactjs/             # React.js skill module
│   │   └── ...
│   └── ...
├── scripts/                 # Development and CI utility scripts
│   └── validate-skills.js   # Script that validates skill frontmatter structure
├── package.json             # Node.js project manifest (dependencies and scripts)
└── README.md                # Repository overview and usage instructions
```

### Components of a Skill Module

Each subdirectory under the `skills/` directory represents a separate skill and should conform to this structure:
1. **`skill.md` (or `SKILL.md`)**: The primary entry point for the skill. It MUST contain YAML frontmatter at the top defining its `name` and `description`.
2. **`references/`**: A subdirectory for secondary documentation. Place detailed configuration instructions, naming conventions, or large code examples here and link to them from `skill.md` to keep the main entry point focused and lightweight.

---

## How to Add a Skill

Follow these steps to add a new skill to the repository:

1. **Create the Skill Directory**  
   Create a new folder under `skills/` named after the technology or standard using kebab-case (e.g., `skills/my-new-technology`).

2. **Create the Main Entry Point**  
   Inside your new folder, create a file named `skill.md`.

3. **Define Frontmatter**  
   At the very top of `skill.md`, add YAML frontmatter containing the `name` and `description`. The `description` is critical because agents use it to determine when to trigger the skill.
   ```yaml
   ---
   name: my-new-technology
   description: Core engineering standards for my-new-technology. Trigger this skill whenever writing, reviewing, or refactoring code involving this technology.
   ---
   ```

4. **Write the Content**  
   Add the core rules, guidelines, and checklist below the frontmatter. For detailed guidance on writing high-quality agent instructions, refer to the official [agentskills.io website](https://agentskills.io/home).

5. **Organize Subtopics (Optional)**  
   If your instructions are extensive, create a `references/` directory next to `skill.md` and move detailed subtopics into individual markdown files (e.g., `references/naming-conventions.md`). Link them in `skill.md` using relative markdown links:
   ```markdown
   For naming conventions, see [naming conventions](references/naming-conventions.md).
   ```

---

## Steps Required Before Pushing to GitHub

Before committing your changes and pushing them to GitHub, you must validate that your new skill conforms to the repository formatting requirements:

1. **Install Dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Run the Validation Script**:
   ```bash
   npm run validate
   ```
   The validation script (located at `scripts/validate-skills.js`) parses the frontmatter of every `skill.md` (or `SKILL.md`) file to ensure both `name` and `description` are defined.

3. **Check the Output**:
   - A successful check will print:
     ```text
     ✅ skills/<your-skill>/skill.md — name and description are present
     ...
     ✅ All X SKILL.md file(s) valid.
     ```
   - If there are errors (e.g., missing properties), the script will exit with status code `1`. You must fix these errors before pushing.
