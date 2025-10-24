const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName, ewrapFile, targetFile) {
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

  const projectPath = projects[projectName];
  const sourceFile = path.join(ewDir, projectName, ewrapFile);
  const targetPath = path.join(projectPath, targetFile);

  if (!(await fs.pathExists(sourceFile))) {
    console.error(`Env file "${ewrapFile}" not found for ${projectName}`);
    return;
  }

  if (await fs.pathExists(targetPath)) {
    await fs.copy(targetPath, `${targetPath}.bak`);
  }

  await fs.copy(sourceFile, targetPath);
  console.log(`✅ Applied ${ewrapFile} → ${targetPath}`);
};
