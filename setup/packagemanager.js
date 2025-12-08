import { execSync } from 'child_process';

const PNPM = 'pnpm';
const YARN = 'yarn';
const NPM = 'npm';

let packageManager;

/** isInstalled returns true if package manager named cmd is installed
 * @param {string} cmd - the name of the package manager
 * @returns {boolean}
 */
function isInstalled(cmd) {
	try {
		execSync(`${cmd} --version`, { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

/** Returns the name of the preferred installed package manager or kills process if
 * none exist. Prefers pnpm > yarn > npm.
 *
 * @returns {string} - the installed package manager
 */
function installedPackageManager() {
	if (isInstalled(PNPM)) {
		return PNPM;
	} else if (isInstalled(YARN)) {
		return YARN;
	} else if (isInstalled(NPM)) {
		return NPM;
	}

	console.error('no package manager found. Please install pnpm, npm, or yarn.');
	process.exit(1);
}

/** Returns the preferred package manager from memory. If none has been stored, checks
 * for an installed package manager, stores it to memory, and returns it.
 *
 * @returns {string} - the currently installed package manager
 */
function getPackageManager() {
	if (!packageManager) {
		packageManager = installedPackageManager();
	}

	return packageManager;
}

/** installDependencies uses the given package manager to install dependencies. Shuts down
 * if any errors are thrown.
 */
function installDependencies() {
	const cmd = getPackageManager();
	try {
		console.log(`installing dependencies with ${cmd}...`);
		execSync(`${cmd} install`, { stdio: 'inherit' });
		console.log('dependencies installed.');
	} catch (err) {
		console.error(`failed to install with ${cmd}:`, err.message);
		process.exit(1);
	}
}

export { getPackageManager, installDependencies };
