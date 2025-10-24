const fs = require('fs-extra');
const path = require('path');

module.exports = async function (projectName) {
  const ewDir = path.join(process.env.HOME, '.sem');
  const projectDir = path.join(ewDir, projectName);

  if (!(await fs.pathExists(projectDir))) {
    console.error(`No envs found for project "${projectName}".`);
    return;
  }

  const files = await fs.readdir(projectDir);
  if (files.length === 0) {
    console.log(`Project "${projectName}" has no stored env files.`);
    return;
  }

  console.log(`🌱 Env files for ${projectName}:`);
  files.forEach(f => console.log(`- ${f}`));
};
