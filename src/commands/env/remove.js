const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName, envFile) {
  const ewDir = path.join(process.env.HOME, '.sem');
  const filePath = path.join(ewDir, projectName, envFile);

  if (!(await fs.pathExists(filePath))) {
    console.error(`Env file "${envFile}" not found for project "${projectName}".`);
    return;
  }

  await fs.remove(filePath);
  console.log(`��️ Removed ${envFile} from ${projectName}`);
};
