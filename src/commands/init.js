const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName) {
  const cwd = process.cwd();
  const semDir = path.join(process.env.HOME, '.sem');
  const projectsFile = path.join(semDir, 'projects.json');

  await fs.ensureDir(semDir);

  let projects = {};
  if (await fs.pathExists(projectsFile)) {
    projects = await fs.readJson(projectsFile);
  }

  // Auto-detect project name from directory if not provided
  const autoName = projectName || path.basename(cwd);

  // Check if this path is already registered
  for (const [name, projectPath] of Object.entries(projects)) {
    if (path.resolve(projectPath) === cwd) {
      console.log(`✅ Project "${name}" is already linked to this directory.`);
      return;
    }
  }

  // Check if name already exists
  if (projects[autoName]) {
    console.error(`Project name "${autoName}" already exists. Use a different name:`);
    console.error(`  sem init <custom-name>`);
    return;
  }

  projects[autoName] = cwd;
  await fs.writeJson(projectsFile, projects, { spaces: 2 });

  console.log(`✅ Initialized project "${autoName}" at ${cwd}`);
  console.log(`\nNext steps:`);
  console.log(`  sem add <env-file> [name]    # Add environment files`);
  console.log(`  sem pull <env> [target]      # Pull env file to local`);
};
