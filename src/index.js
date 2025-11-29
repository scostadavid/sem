const { Command } = require('commander');
const program = new Command();

program
  .name('sem')
  .description('SEM (Some Env Manager) CLI :: manage and apply environment configs across projects')
  .version('1.0.1');

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
  .command('use <project> <envFile> <target>')
  .description('Apply a stored env file to the target project directory')
  .action(require('./commands/env/use'));

env
  .command('remove <project> <envFile>')
  .description('Remove a stored env file from a project')
  .action(require('./commands/env/remove'));

program.parse(process.argv);
