const { Command } = require('commander');
const program = new Command();

program
  .name('sem')
  .description('SEM (Some Env Manager) CLI :: manage and apply environment configs across projects')
  .version('2.0.0');

//
// INIT COMMAND (top-level)
//
program
  .command('init [name]')
  .description('Initialize current directory as a sem project')
  .action(require('./commands/init'));

//
// PROJECT COMMANDS
//
const project = program.command('project').description('Manage linked projects');

project
  .command('add <name> <path>')
  .description('Link a project to a path')
  .action(require('./commands/project/add'));

project
  .command('list')
  .description('List all linked projects')
  .action(require('./commands/project/list'));

project
  .command('remove <name>')
  .description('Unlink a project')
  .action(require('./commands/project/remove'));

//
// ENV COMMANDS
//
const env = program.command('env').description('Manage stored environment files for projects');

env
  .command('add <project> <sourceFile> [envName]')
  .description('Add an environment file to a project')
  .action(require('./commands/env/add'));

env
  .command('list [project]')
  .description('List stored environment files for a project (or all projects if omitted)')
  .action(require('./commands/env/list'));

env
  .command('remove <project> <envFile>')
  .description('Remove a stored env file from a project')
  .action(require('./commands/env/remove'));

env
  .command('pull <envFile> [target] [project]')
  .description('Pull stored env file to local (storage → local)')
  .action(require('./commands/env/pull'));

env
  .command('push [target] [envName] [project]')
  .description('Push local changes to stored env file (local → storage)')
  .action(require('./commands/env/push'));

env
  .command('diff <envFile> [target] [project]')
  .description('Show differences between stored and local env files')
  .action(require('./commands/env/diff'));

env
  .command('sync <envFile> [target] [project]')
  .description('Sync stored and local env files (bidirectional)')
  .action(require('./commands/env/sync'));

//
// SHORT ALIASES (top-level for better UX)
//
program
  .command('pull <envFile> [target] [project]')
  .description('Pull stored env to local (storage → local)')
  .action(require('./commands/env/pull'));

program
  .command('push [target] [envName] [project]')
  .description('Push local changes to storage (local → storage)')
  .action(require('./commands/env/push'));

program
  .command('add <sourceFile> [envName] [project]')
  .description('Add an env file (alias for env add, infers project)')
  .action(require('./commands/env/add'));

program
  .command('ls [project]')
  .description('List env files (alias for env list)')
  .action(require('./commands/env/list'));

program
  .command('diff <envFile> [target] [project]')
  .description('Show diff (alias for env diff)')
  .action(require('./commands/env/diff'));

program
  .command('sync <envFile> [target] [project]')
  .description('Sync env files (alias for env sync)')
  .action(require('./commands/env/sync'));

program.parse(process.argv);
