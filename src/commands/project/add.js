const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName, projectPath) {
  const ewDir = path.join(process.env.HOME, '.sem');
  const projectsFile = path.join(ewDir, 'projects.json');

  await fs.ensureDir(ewDir);

  let projects = {};
  if (await fs.pathExists(projectsFile)) {
    projects = await fs.readJson(projectsFile);
  }

  projects[projectName] = projectPath;
  await fs.writeJson(projectsFile, projects, { spaces: 2 });

  console.log(`✅ Project "${projectName}" linked to ${projectPath}`);
};
