const fs = require('fs-extra');
const path = require('path');

module.exports = async function () {
  const semDir = path.join(process.env.HOME, '.sem');
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

  console.log('📦 Linked projects:');

  for (const [name, projectPath] of entries) {
    console.log(`- ${name}: ${projectPath}`);

    const envDir = path.join(semDir, name);
    if (await fs.pathExists(envDir)) {
      const files = await fs.readdir(envDir);
      if (files.length > 0) {
        console.log('  🌱 Env files:');
        files.forEach(f => console.log(`    - ${f}`));
      } else {
        console.log('  🌱 No env files stored.');
      }
    } else {
      console.log('  🌱 No env files stored.');
    }
  }
};
