import fs from 'fs';

const pkgPath = './package.json';

/** Sets a new property or overwrites existing property in package.json at key. Only sets
 * keys at the top level of the object.
 *
 * ASSUME: newValue is a valid JSON object.
 *
 * @param {string} key - key in the package.json object
 * @param {string|number|boolean|null|Object.<string, *>} newValue - JSON value that will be written to the key
 */
function updatePackageProperty(key, newValue) {
	const packageJSON = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	packageJSON[key] = newValue;
	fs.writeFileSync(pkgPath, JSON.stringify(packageJSON, null, 2));
	console.log(`package.json ${key} set to ${newValue}`);
}

/** Sets a new property or overwrites existing property in the object located at packge.json objectKey.
 * Only sets keys at the second to top level of package.json object.
 *
 * ASSUME: field at package.json[objectKey] is meant to take an object
 *
 * @param {string} objectKey - key at the top level of package.json that has an object value
 * @param {string} newPropertyKey - key in the object that package.json[objectKey] points to
 * @param {string|number|boolean|null|Object.<string, *>} newPropertyValue - new value written at package.json[objectKey][newPropertyKey]
 */
function updatePackageObjectProperty(
	objectKey,
	newPropertyKey,
	newPropertyValue
) {
	const packageJSON = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

	// create the objectKey field if it doesn't already exist
	packageJSON[objectKey] = packageJSON[objectKey] ? packageJSON[objectKey] : {};

	packageJSON[objectKey][newPropertyKey] = newPropertyValue;
	fs.writeFileSync(pkgPath, JSON.stringify(packageJSON, null, 2));

	console.log(
		`package.json[${objectKey}][${newPropertyKey}] set to ${newPropertyValue}`
	);
}

export { updatePackageProperty, updatePackageObjectProperty };
