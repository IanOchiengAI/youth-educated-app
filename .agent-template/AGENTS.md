# Agent Instructions (Master Template)

> This is the parent template. Individual brand projects should reference this for the core agent architecture.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**

- SOPs written in Markdown, live in `directives/`
- Define goals, inputs, tools/scripts, outputs, and edge cases
- Natural language instructions

**Layer 2: Orchestration (Decision making)**

- You (the AI). Intelligent routing.
- Read directives, call execution tools, handle errors, update directives

**Layer 3: Execution (Doing the work)**

- Deterministic Python scripts in `execution/`
- API calls, data processing, file operations
- Reliable, testable, fast

## Operating Principles

1. **Check for tools first** - Look in `execution/` before writing new scripts
2. **Self-anneal when things break** - Fix, test, update directive
3. **Update directives as you learn** - Living documents

## Directory Structure (Per Brand Project)

```
[Brand] Website/
├── AGENTS.md              # Links to this master template
├── .agent/workflows/      # Brand-specific skills (inherits from master)
├── directives/            # Brand-specific SOPs
├── execution/             # Brand-specific scripts
├── .tmp/                  # Temporary files
└── .env                   # Brand-specific API keys
```

## Brand Projects Registry

The following brand websites inherit from this master template:

| Brand | Project Folder | Status | Description |
|-------|---------------|--------|-------------|
| **Aquila** | `Aquila's Website/` | 🟡 Active | Aquila brand website (GitHub-linked) |
| **Ian Ochieng AI Portfolio** | `Ian Ochieng AI Portfolio/` | 🔵 Pending Setup | Personal AI portfolio website |
| **Zaidi Ya Misuli** | `Zaidi Ya Misuli/` | 🔵 Pending Setup | Zaidi Ya Misuli brand website |

---

## Shared Skills (Inherited by All Brands)

All brand projects inherit these skills from the master template:

| Skill | Purpose |
|-------|---------|
| `brand-extractor/` | Extract brand identity from any website |
| `brand-guidelines/` | Enforce consistent brand styling |
| `frontend-design/` | Build beautiful web applications |
| `skill-creator/` | Create new skills following best practices |

## How to Set Up a New Brand Project

1. Create the directory structure shown above
2. Copy or symlink the `.agent/workflows/` from this master template
3. Create brand-specific `AGENTS.md` that references this document
4. Add brand-specific directives and execution scripts as needed

## File Organization

- **Deliverables**: Google Sheets, Slides, or cloud-based outputs
- **Intermediates**: `.tmp/` folder (never commit)
- **Credentials**: `.env`, `credentials.json`, `token.json` (in `.gitignore`)

---

*Be pragmatic. Be reliable. Self-anneal.*
