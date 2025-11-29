const fs = require('fs-extra');
const path = require('path');
const { resolveProject } = require('../../utils/projectResolver');

module.exports = async function (sourceFileOrProject, envNameOrSource, maybeName) {
  // Support both old and new API
  // Old: sem env add <project> <sourceFile> [envName]
  // New: sem add <sourceFile> [envName] (infers project)

  let projectName, sourceFile, envName;

  if (maybeName !== undefined || (envNameOrSource && !envNameOrSource.includes('/'))) {
    // Old API: first arg is project name
    // Check if first arg is actually a project
    const semDir = path.join(process.env.HOME, '.sem');
    const projectsFile = path.join(semDir, 'projects.json');

    if (await fs.pathExists(projectsFile)) {
      const projects = await fs.readJson(projectsFile);
      if (projects[sourceFileOrProject]) {
        // Old API
        projectName = sourceFileOrProject;
        sourceFile = envNameOrSource;
        envName = maybeName;
      } else {
        // New API
        projectName = null;
        sourceFile = sourceFileOrProject;
        envName = envNameOrSource;
      }
    } else {
      // No projects file, assume new API
      projectName = null;
      sourceFile = sourceFileOrProject;
      envName = envNameOrSource;
    }
  } else {
    // New API: sem add <sourceFile> [envName]
    projectName = null;
    sourceFile = sourceFileOrProject;
    envName = envNameOrSource;
  }

  const project = await resolveProject(projectName);

  if (!project) {
    if (projectName) {
      console.error(`Project "${projectName}" not found.`);
    } else {
      console.error('Could not infer project. Please specify project name or run from project directory.');
      console.error('Tip: Run "sem init" first or use "sem env add <project> <file>"');
    }
    return;
  }

  const semDir = path.join(process.env.HOME, '.sem');
  const projectEnvDir = path.join(semDir, project.name);
  await fs.ensureDir(projectEnvDir);

  const targetFileName = envName || path.basename(sourceFile);
  const targetPath = path.join(projectEnvDir, targetFileName);

  if (!(await fs.pathExists(sourceFile))) {
    console.error(`Source file "${sourceFile}" not found.`);
    return;
  }

  await fs.copy(sourceFile, targetPath);
  console.log(`📁 Added ${sourceFile} → ${project.name}/${targetFileName}`);
};
