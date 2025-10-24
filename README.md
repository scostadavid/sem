# sem CLI — Technical Documentation

## Overview

`sem` is a Node.js CLI tool designed to manage and apply environment configuration files (`.env`, `local.settings.json`, etc.) across multiple projects.  
It enables developers to store and switch between environment files locally using simple commands.

The project uses **Commander.js** for command-line parsing and **fs-extra** for file and directory management.

---

## Project Structure

```
sem/
├── bin/
│   └── sem.js           # CLI entry point
├── src/
│   ├── index.js           # Commander setup
│   └── commands/          # Individual command handlers
├── package.json
```

---

## Core Technologies

- **Node.js** — runtime
- **Commander.js** — CLI command parser
- **fs-extra** — extended filesystem utilities
- **Chalk** — optional colored output (for later enhancements)

---

## Installation and Setup

### 1. Initialize project

```bash
npm init -y
npm install commander chalk fs-extra
```

### 2. Make the binary executable

```bash
chmod +x bin/sem.js
```

### 3. Link the CLI globally (for local testing)

```bash
npm link
```

This makes the CLI available globally as `sem-dev` (based on the `bin` field in `package.json`).

---

## CLI Entry Point

### `bin/sem.js`

```js
#!/usr/bin/env node
require('../src/index.js');
```

The shebang allows direct execution from the terminal.  
All CLI logic is delegated to `src/index.js`.

---

## Data Storage

- Root directory for sem data:  
  `~/.sem/`

- Project registry file:  
  `~/.sem/projects.json`

- Environment file storage per project:  
  `~/.sem/<project_name>/`

Example structure:

```
~/.sem/
├── projects.json
└── project1/
    ├── dev.env
    ├── staging.env
    └── prod.env
```

---

## Commands

### 1. `add`

Registers a new project by linking a project name to a filesystem path.

```bash
sem-dev add <project_name> <path>
```

Stores mapping in `~/.sem/projects.json`.

### 2. `list`

Displays all registered projects.

```bash
sem-dev list
```

Reads and prints mappings from `projects.json`.

### 3. `add-file`

Adds a file (such as `.env` or `local.settings.json`) to the project’s storage in `~/.sem/<project_name>/`.

```bash
sem-dev add-file <project_name> <source_file> [ewrap_name]
```

Ensures the project directory exists, then copies and optionally renames the file.

### 4. `use`

Applies a stored environment file from `~/.sem/<project_name>/` to the linked project directory.

```bash
sem-dev use <project_name> <ewrap_file> <target_file>
```

Copies `<ewrap_file>` into `<project_path>/<target_file>`, creating a `.bak` backup if the target exists.

---

## Local Development Workflow

Run in development mode:

```bash
npm run start -- <args>
```

Example:

```bash
npm run start -- list
```

Or use the globally linked CLI:

```bash
sem-dev list
```

---

## Design Notes

- Modular command structure (`src/commands/`).
- State/config stored in JSON.
- `use` performs direct file copy operations (no symlinks or template parsing yet).
- Extensible for new commands and colorized output.

---

## Next Steps

1. Implement `remove` command for projects.  
2. Add `list-files` command to show available envs per project.  
3. Use Chalk for colored output.  
4. Add better error handling and logging.  
5. Support custom config paths via `EW_HOME`.  
6. Separate prod (`sem`) and dev (`sem-dev`) versions.

