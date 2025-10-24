const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName) {
  const ewDir = path.join(process.env.HOME, '.sem');
  const projectsFile = path.join(ewDir, 'projects.json');

  if (!(await fs.pathExists(projectsFile))) {
    console.error('No projects linked.');
    return;
  }

  const projects = await fs.readJson(projectsFile);
  if (!projects[projectName]) {
    console.error(`Project "${projectName}" not found.`);
    return;
  }

  delete projects[projectName];
  await fs.writeJson(projectsFile, projects, { spaces: 2 });

  console.log(`🗑️ Project "${projectName}" removed.`);
};
