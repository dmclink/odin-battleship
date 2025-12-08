import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
	removeFromGitTracking,
	deleteFilesAndDirs,
	getProjectName,
	updatePackageProperty,
	installDependencies,
	setupWebpack,
} from './setup/index.js';

const fileName = fileURLToPath(import.meta.url);
const thisFile = path.basename(fileName);
const setupDir = './setup/';

async function main() {
	const projectName = getProjectName();

	// update package.json with current repo name
	updatePackageProperty('name', projectName);

	installDependencies();

	// overwrite README.md for new project
	const newReadme = `# ${projectName}\n\nTODO:\n`;
	fs.writeFileSync('README.md', newReadme, 'utf8');
	console.log('README.md has been reset.');

	// ask and set up webpack
	await setupWebpack();

	// remove setup.js (thisFile) and directory ./setup/ (setupDir) from Git tracking
	removeFromGitTracking(thisFile);
	removeFromGitTracking(setupDir);

	// delete setup.js (thisFile) and directory ./setup/ (setupDir) from Git tracking
	deleteFilesAndDirs(thisFile, setupDir);
}

await main();
