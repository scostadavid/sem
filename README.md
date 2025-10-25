# sem CLI

`sem` (**Some Env Manager**) is a Node.js CLI tool for managing and applying environment configuration files (`.env`, `local.settings.json`, etc.) across multiple projects.  
It allows developers to **link projects**, **store multiple environment files**, and **quickly apply them** using simple structured commands.

The CLI is built with **Commander.js** and uses **fs-extra** for file management.

## Project Structure

```
sem/
├── bin/
│   └── sem.js             # CLI entry point
├── src/
│   ├── index.js           # Commander setup
│   └── commands/
│       ├── project/       # Project management commands
│       └── env/           # Environment file commands
├── package.json
```

## Core Technologies

- **Node.js**: run´ime
- **Commander.js**: CLI command parser
- **fs-extra**: file and directory utilities

---

## Installation and Setup

### 1. Initialize and install dependencies

```bash
npm init -y
npm install commander fs-extra chalk
```

### 2. Make the binary executable

```bash
chmod +x bin/sem.js
```

### 3. Link globally (for local testing)

```bash
npm link
```

This registers the CLI globally under the name `sem`.

## CLI Entry Point

### `bin/sem.js`

```js
#!/usr/bin/env node
require('../src/index.js');
```

The shebang allows executing the CLI directly.  
All logic resides in `src/index.js`.

## Data Storage

- Root config directory:  
  `~/.sem/`

- Registered projects file:  
  `~/.sem/projects.json`

- Environment file storage:  
  `~/.sem/<project_name>/`

Example:

```
~/.sem/
├── projects.json
└── my-app/
    ├── dev.env
    ├── staging.env
    └── prod.env
```

## Commands Overview

### **Project Commands**
Manage linked projects.

#### Add a project
```bash
sem project add <name> <path>
```
Links a project name to a local filesystem path and stores it in `~/.sem/projects.json`.

#### List all projects
```bash
sem project list
```
Displays all linked projects and their paths.

#### Remove a project
```bash
sem project remove <name>
```
Unlinks and deletes the project record from `projects.json`.

---

### **Environment Commands**
Manage stored environment files for a linked project.

#### Add a new environment file
```bash
sem env add <project> <sourceFile> [envName]
```
Copies a source file (e.g. `.env`) into `~/.sem/<project>/`  
Optionally renames it as `[envName]`.

#### List environment files
```bash
sem env list <project>
```
Displays all environment files stored for a given project.

#### Apply an environment file
```bash
sem env use <project> <envFile> <target>
```
Copies `<envFile>` from the sem store to the project’s `<target>` file (e.g., `.env`).  
If the target exists, a `.bak` backup is created first.

#### Remove an environment file
```bash
sem env remove <project> <envFile>
```
Deletes a stored environment file from `~/.sem/<project>/`.

## Example Workflow

```bash
# 1. Link a local project
sem project add my-app ~/projects/my-app

# 2. Store a .env file for it
sem env add my-app ./envs/dev.env dev.env

# 3. Apply it to the project
sem env use my-app dev.env .env

# 4. List available projects and envs
sem project list
sem env list my-app

# 5. Remove env or project if needed
sem env remove my-app dev.env
sem project remove my-app
```

## Local Development

Run directly with Node:

```bash
npm run start -- <command>
```

Example:

```bash
npm run start -- project list
```

Or use the globally linked binary:

```bash
sem project list
```

## Design Notes

- Modular command structure under `src/commands/`.
- JSON-based configuration for persistence.
- Extensible: easy to add new commands or features.
- Future additions planned:
  - Colorized output with Chalk.
  - Better error and log handling.

## Next Steps

-  Implement configuration path override (`SEM_HOME` env var).
- Add export/import of project sets.
- Improve output formatting (colors, tables).  
- Improve backup for env override process (store backup on sem folder)