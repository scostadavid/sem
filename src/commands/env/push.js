const fs = require('fs-extra');
const path = require('path');
const { resolveProject } = require('../../utils/projectResolver');

module.exports = async function (targetFile = '.env', envName, projectName) {
  const project = await resolveProject(projectName);

  if (!project) {
    if (projectName) {
      console.error(`Project "${projectName}" not found.`);
    } else {
      console.error('Could not infer project. Please specify project name or run from project directory.');
    }
    return;
  }

  const semDir = path.join(process.env.HOME, '.sem');
  const sourcePath = path.join(project.path, targetFile);

  if (!(await fs.pathExists(sourcePath))) {
    console.error(`File "${targetFile}" not found in project directory.`);
    return;
  }

  // If envName not provided, use the targetFile name
  const finalEnvName = envName || path.basename(targetFile);
  const projectEnvDir = path.join(semDir, project.name);
  await fs.ensureDir(projectEnvDir);

  const targetPath = path.join(projectEnvDir, finalEnvName);

  // Create backup if file exists
  if (await fs.pathExists(targetPath)) {
    const backupPath = `${targetPath}.bak.${Date.now()}`;
    await fs.copy(targetPath, backupPath);
    console.log(`📦 Backup created: ${path.basename(backupPath)}`);
  }

  await fs.copy(sourcePath, targetPath);
  console.log(`⬆️  Pushed ${targetFile} → ${project.name}/${finalEnvName}`);
};
