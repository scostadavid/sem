const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName) {
  const semDir = path.join(process.env.HOME, '.sem');

  if (!projectName) {
    const projectsFile = path.join(semDir, 'projects.json');

    if (!(await fs.pathExists(projectsFile))) {
      console.log('No projects linked yet.');
      return;
    }

    const projects = await fs.readJson(projectsFile);
    const entries = Object.entries(projects);

    if (entries.length === 0) {
      console.log('No projects linked yet.');
      return;
    }

    console.log('🌱 Env files:');

    for (const [name] of entries) {
      const envDir = path.join(semDir, name);
      if (await fs.pathExists(envDir)) {
        const files = await fs.readdir(envDir);
        if (files.length > 0) {
          console.log(`\n📦 ${name}:`);
          files.forEach(f => console.log(`  - ${f}`));
        }
      }
    }
    return;
  }

  // Original behavior: list envs for specific project
  const projectDir = path.join(semDir, projectName);

  if (!(await fs.pathExists(projectDir))) {
    console.error(`No envs found for project "${projectName}".`);
    return;
  }

  const files = await fs.readdir(projectDir);
  if (files.length === 0) {
    console.log(`Project "${projectName}" has no stored env files.`);
    return;
  }

  console.log(`🌱 Env files for ${projectName}:`);
  files.forEach(f => console.log(`- ${f}`));
};
