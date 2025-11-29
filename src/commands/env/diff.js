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
  const storedPath = path.join(semDir, project.name, envFile);
  const localPath = path.join(project.path, targetFile);

  if (!(await fs.pathExists(storedPath))) {
    console.error(`Stored env file "${envFile}" not found for ${project.name}`);
    return;
  }

  if (!(await fs.pathExists(localPath))) {
    console.error(`Local file "${targetFile}" not found in project directory.`);
    return;
  }

  const storedContent = await fs.readFile(storedPath, 'utf8');
  const localContent = await fs.readFile(localPath, 'utf8');

  if (storedContent === localContent) {
    console.log(`✅ No differences between stored "${envFile}" and local "${targetFile}"`);
    return;
  }

  console.log(`📊 Differences between stored "${envFile}" and local "${targetFile}":\n`);

  // Simple line-by-line diff
  const storedLines = storedContent.split('\n');
  const localLines = localContent.split('\n');

  const maxLines = Math.max(storedLines.length, localLines.length);
  let hasDiff = false;

  for (let i = 0; i < maxLines; i++) {
    const storedLine = storedLines[i];
    const localLine = localLines[i];

    if (storedLine !== localLine) {
      hasDiff = true;
      console.log(`Line ${i + 1}:`);
      if (storedLine !== undefined) {
        console.log(`  - (stored) ${storedLine}`);
      }
      if (localLine !== undefined) {
        console.log(`  + (local)  ${localLine}`);
      }
      console.log();
    }
  }

  if (!hasDiff) {
    console.log(`✅ Files are identical`);
  }
};
