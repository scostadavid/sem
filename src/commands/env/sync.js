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

  const storedExists = await fs.pathExists(storedPath);
  const localExists = await fs.pathExists(localPath);

  if (!storedExists && !localExists) {
    console.error(`Neither stored "${envFile}" nor local "${targetFile}" exist.`);
    return;
  }

  // If only stored exists, copy to local
  if (storedExists && !localExists) {
    await fs.copy(storedPath, localPath);
    console.log(`⬇️  Synced: stored → local (${targetFile})`);
    return;
  }

  // If only local exists, copy to stored
  if (!storedExists && localExists) {
    const projectEnvDir = path.join(semDir, project.name);
    await fs.ensureDir(projectEnvDir);
    await fs.copy(localPath, storedPath);
    console.log(`⬆️  Synced: local → stored (${envFile})`);
    return;
  }

  // Both exist - check if they're different
  const storedContent = await fs.readFile(storedPath, 'utf8');
  const localContent = await fs.readFile(localPath, 'utf8');

  if (storedContent === localContent) {
    console.log(`✅ Already in sync`);
    return;
  }

  // Get modification times
  const storedStats = await fs.stat(storedPath);
  const localStats = await fs.stat(localPath);

  // Sync from newer to older
  if (localStats.mtime > storedStats.mtime) {
    // Create backup
    const backupPath = `${storedPath}.bak.${Date.now()}`;
    await fs.copy(storedPath, backupPath);

    await fs.copy(localPath, storedPath);
    console.log(`⬆️  Synced: local → stored (local was newer)`);
    console.log(`📦 Backup: ${path.basename(backupPath)}`);
  } else {
    // Create backup
    const backupPath = `${localPath}.bak.${Date.now()}`;
    await fs.copy(localPath, backupPath);

    await fs.copy(storedPath, localPath);
    console.log(`⬇️  Synced: stored → local (stored was newer)`);
    console.log(`📦 Backup: ${path.basename(backupPath)}`);
  }
};
