const fs = require('fs-extra');
const path = require('path');

/**
 * Resolves project name from current directory or explicit name
 * @param {string} projectName - Optional project name
 * @returns {Promise<{name: string, path: string} | null>}
 */
async function resolveProject(projectName) {
  const semDir = path.join(process.env.HOME, '.sem');
  const projectsFile = path.join(semDir, 'projects.json');

  if (!(await fs.pathExists(projectsFile))) {
    return null;
  }

  const projects = await fs.readJson(projectsFile);
  const entries = Object.entries(projects);

  if (entries.length === 0) {
    return null;
  }

  // If project name is explicitly provided, use it
  if (projectName) {
    if (!projects[projectName]) {
      return null;
    }
    return { name: projectName, path: projects[projectName] };
  }

  // Try to infer from current directory
  const cwd = process.cwd();

  // Check if current directory matches any project path
  for (const [name, projectPath] of entries) {
    const resolvedPath = path.resolve(projectPath);
    if (cwd === resolvedPath || cwd.startsWith(resolvedPath + path.sep)) {
      return { name, path: projectPath };
    }
  }

  // If only one project exists, use it as default
  if (entries.length === 1) {
    const [name, projectPath] = entries[0];
    return { name, path: projectPath };
  }

  return null;
}

/**
 * Gets all projects
 * @returns {Promise<Object>}
 */
async function getAllProjects() {
  const semDir = path.join(process.env.HOME, '.sem');
  const projectsFile = path.join(semDir, 'projects.json');

  if (!(await fs.pathExists(projectsFile))) {
    return {};
  }

  return await fs.readJson(projectsFile);
}

module.exports = {
  resolveProject,
  getAllProjects
};
