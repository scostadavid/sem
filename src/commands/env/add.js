const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName, sourceFile, ewrapName) {
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

  const projectEwrapDir = path.join(ewDir, projectName);
  await fs.ensureDir(projectEwrapDir);

  const targetFileName = ewrapName || path.basename(sourceFile);
  const targetPath = path.join(projectEwrapDir, targetFileName);

  await fs.copy(sourceFile, targetPath);
  console.log(`📁 Added ${sourceFile} → ${projectName}/${targetFileName}`);
};
