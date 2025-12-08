import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function removeFromGitTracking(fileName) {
	let recursiveFlag = '';
	if (fs.lstatSync(fileName).isDirectory()) {
		recursiveFlag = '-r ';
	}

	try {
		execSync(`git rm ${recursiveFlag}--cached ${fileName}`, {
			stdio: 'inherit',
		});
		console.log(`${fileName} removed from Git tracking.`);
	} catch (err) {
		console.warn(`could not remove ${fileName} from tracking:`, err.message);
	}
}

function getProjectName() {
	let projectName;
	try {
		// Try to get the Git remote URL
		const remoteUrl = execSync('git config --get remote.origin.url')
			.toString()
			.trim();
		const match = remoteUrl.match(/\/([^/]+)\.git$/);
		if (match && match[1]) {
			[, projectName] = match;
			console.log(
				`git remote detected: using "${projectName}" as project name`
			);
		} else {
			throw new Error('remote URL format not recognized');
		}
	} catch (err) {
		// Fallback to folder name
		projectName = path.basename(process.cwd());
		console.error(
			err,
			`no git remote found: using folder name "${projectName}"`
		);
	}

	return projectName;
}

/** Deletes all files and directories passed to paths. Directories get forced recursive
 * deletion so all files and folders contained within will also be deleted. If errors
 * are encountered during deletion the file is skipped and errors are printed to console.
 *
 * @param  {...string} paths - the paths to all files and directories to delete
 */
function deleteFilesAndDirs(...paths) {
	console.log('deleting files...');
	const errors = [];
	for (const path of paths) {
		if (fs.existsSync(path)) {
			if (fs.lstatSync(path).isFile()) {
				try {
					fs.unlinkSync(path);
				} catch (err) {
					errors.push(
						new Error`failed to delete file ${path}: ${err.message}`(),
						{ cause: err }
					);
				}
			} else if (fs.lstatSync(path).isDirectory()) {
				try {
					fs.rmSync(path, { recursive: true, force: true });
				} catch (err) {
					errors.push(
						new Error`failed to delete file ${path}: ${err.message}`(),
						{ cause: err }
					);
				}
			} else {
				errors.push(new Error(`unknown file type at: ${path}`));
			}
		} else {
			errors.push(new Error(`no file exists at: ${path}`));
		}
	}

	for (const err of errors) {
		console.error(err.message);
	}
}

export { removeFromGitTracking, getProjectName, deleteFilesAndDirs };
