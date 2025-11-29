const fs = require('fs-extra');
const path = require('path');
const { resolveProject } = require('../../utils/projectResolver');

module.exports = async function (envFile, targetFile = '.env', projectName) {
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
  const sourceFile = path.join(semDir, project.name, envFile);
  const targetPath = path.join(project.path, targetFile);

  if (!(await fs.pathExists(sourceFile))) {
    console.error(`Env file "${envFile}" not found for ${project.name}`);
    return;
  }

  if (await fs.pathExists(targetPath)) {
    const backupPath = `${targetPath}.bak.${Date.now()}`;
    await fs.copy(targetPath, backupPath);
    console.log(`📦 Backup: ${path.basename(backupPath)}`);
  }

  await fs.copy(sourceFile, targetPath);
  console.log(`⬇️  Pulled ${envFile} → ${targetPath}`);
};
