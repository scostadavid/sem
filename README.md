# sem CLI

`sem` (**Some Env Manager**) is a context-aware Node.js CLI tool for managing and applying environment configuration files (`.env`, `local.settings.json`, etc.) across multiple projects.

## Installation

```bash
npm install -g sem # soon
```

Or for development:

```bash
git clone <repo>
cd sem
npm install
npm link
```

## Quick Start

```bash
# Initialize your project (from project directory)
cd ~/projects/my-app
sem init

# Add environment files to sem storage
sem add .env.production prod
sem add .env.staging staging

# Pull environments from storage to local
sem pull prod             # pulls to .env by default
sem pull staging .env.local # pulls to .env.local

# Make local changes and push them back
# ... edit .env locally ...
sem push                  # pushes changes back to storage

# Compare versions
sem diff prod             # see what changed
```

## Data Storage

- Root config directory: `~/.sem/`
- Registered projects: `~/.sem/projects.json`
- Environment files: `~/.sem/<project_name>/`

Example structure:
```
~/.sem/
├── projects.json
└── my-app/
    ├── prod
    ├── staging
    ├── dev
    └── prod.bak.1638360000000
```

## Commands Reference

### Quick Commands (Recommended)

These commands automatically infer your project from the current directory:

#### `sem init [name]`
Initialize current directory as a sem project.

```bash
cd ~/projects/my-app
sem init              # uses directory name
sem init myapp        # custom name
```

#### `sem add <file> [name]`
Add an environment file to the current project.

```bash
sem add .env.production prod
sem add .env.staging           # uses filename as name
```

#### `sem pull <env> [target]`
Pull a stored environment file to local (storage → local).

```bash
sem pull prod              # pulls to .env (default)
sem pull staging .env.local
```

#### `sem push [target] [name]`
Push local changes to storage (local → storage).

```bash
sem push              # pushes .env and saves with same name
sem push .env prod    # pushes .env and saves as "prod"
```

#### `sem ls [project]`
List environment files.

```bash
sem ls                # lists all projects and their envs
sem ls myapp          # lists envs for specific project
```

#### `sem diff <env> [target]`
Show differences between stored and local files.

```bash
sem diff prod              # compares stored "prod" with local .env
sem diff staging .env.local
```

#### `sem sync <env> [target]`
Sync between stored and local (uses newer file).

```bash
sem sync prod              # syncs based on modification time
sem sync staging .env.local
```

---

### Full Commands (Explicit Project Names)

All commands support explicit project names for advanced usage:

#### Project Management

```bash
# Add a project
sem project add <name> <path>
sem project add my-app ~/projects/my-app

# List all projects
sem project list

# Remove a project
sem project remove <name>
```

#### Environment Management

```bash
# Add environment file
sem env add <project> <file> [name]
sem env add my-app .env.production prod

# List environment files
sem env list [project]
sem env list              # all projects
sem env list my-app       # specific project

# Pull environment file (storage → local)
sem env pull <env> [target] [project]
sem env pull prod .env my-app

# Push local changes (local → storage)
sem env push [target] [name] [project]
sem env push .env prod my-app

# Remove environment file
sem env remove <project> <env>
sem env remove my-app old-env

# Diff files
sem env diff <env> [target] [project]
sem env diff prod .env my-app

# Sync files
sem env sync <env> [target] [project]
sem env sync prod .env my-app
```

---

## Workflow Examples

### Example 1: New Project Setup

```bash
# Navigate to your project
cd ~/projects/my-api

# Initialize
sem init my-api

# Add your environment files
sem add .env.development dev
sem add .env.staging staging
sem add .env.production prod

# Start using them
sem pull dev
```

### Example 2: Switching Environments

```bash
cd ~/projects/my-api

# Pull staging environment
sem pull staging
# Pulled staging → /home/user/projects/my-api/.env

# Check what's different from prod
sem diff prod

# Pull prod environment
sem pull prod
```

### Example 3: Updating Stored Configs

```bash
cd ~/projects/my-api

# Pull production env
sem pull prod

# Make some local changes to .env
nvim .env

# Push changes back to storage
sem push .env prod
# Pushed .env → my-api/prod
# Backup created: prod.bak.1638360000000
```

### Example 4: Multi-Project Management

```bash
# Setup multiple projects
cd ~/projects/frontend
sem init frontend
sem add .env.prod prod

cd ~/projects/backend
sem init backend
sem add .env.prod prod

# List all
sem ls
# 🌱 Env files:
#
# 📦 frontend:
#   - prod
#
# 📦 backend:
#   - prod

# Work from anywhere
cd ~/projects/frontend
sem pull prod             # pulls frontend's prod

cd ~/projects/backend
sem pull prod             # pulls backend's prod
```

## Technologies

- **Node.js**: Runtime environment
- **Commander.js**: CLI framework
- **fs-extra**: Enhanced file operations

---

## Troubleshooting

### "Could not infer project"

This means `sem` couldn't automatically detect your project. Either:
- Run `sem init` in your project directory first
- Use the explicit form: `sem env pull <env> [target] <project>`

### Files not syncing

Make sure you're in the correct project directory or specify the project explicitly:

```bash
# From project directory
sem pull prod

# Or explicitly
sem env pull prod .env my-project
```

---

## Roadmap
SOON
