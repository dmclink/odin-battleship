import { createInterface } from 'readline';
import { execSync } from 'child_process';
import fs from 'fs';

import { updatePackageObjectProperty } from './packagejson.js';
import { getPackageManager, installDependencies } from './packagemanager.js';

const utf8 = 'utf8';
const webpackCommonPath = './webpack.common.js';
const webpackProdPath = './webpack.prod.js';
const webpackDevPath = './webpack.dev.js';
const htmlDirPath = './src/html';
const cssDirPath = './src/css';
const htmlTemplatePath = './src/html/template.html';
const cssTemplatePath = './src/css/style.css';

const webpackCommonData = `
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
	entry: './src/js/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/html/template.html',
		}),
	],
	module: {
		rules: [
			{
				test: /\\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
};
`;

const webpackDevData = `
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
		watchFiles: ['./src/html/template.html'],
	},
});
`;

const webpackProdData = `
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
	mode: 'production',
	devtool: 'source-map',
});
`;

function getUserInput(question) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer);
		});
	});
}

async function wantsWebpack() {
	const input = await getUserInput('Do you want webpack? (yes, y, true): ');

	let result = false;

	switch (input.toLowerCase()) {
		case 'yes':
		case 'y':
		case 'ye':
		case 'yea':
		case 'ok':
		case 'true':
			result = true;
			break;

		default:
			// do nothing just let the function close the readline and return result as initialized false
			break;
	}

	return result;
}

async function setupWebpack() {
	if (!(await wantsWebpack())) {
		console.log('skipping webpack installation');
		return;
	}

	console.log('setting up webpack...');
	const pkg = getPackageManager();

	execSync(`${pkg} add -D webpack webpack-cli`);
	execSync(`${pkg} add -D html-webpack-plugin`);
	execSync(`${pkg} add -D html-loader`);
	execSync(`${pkg} add -D style-loader css-loader`);
	execSync(`${pkg} add -D webpack-merge`);
	execSync(`${pkg} add -D webpack-dev-server`);

	installDependencies();

	try {
		await fs.mkdirSync(htmlDirPath, { recursive: true });
	} catch (err) {
		console.error(`error creating directory ${htmlDirPath}`, err.message);
	}

	try {
		await fs.mkdirSync(cssDirPath, { recursive: true });
	} catch (err) {
		console.error(`error creating directory ${cssDirPath}`, err.message);
	}

	try {
		await fs.writeFileSync(htmlTemplatePath, '', utf8);
	} catch (err) {
		console.error(`error creating file ${htmlTemplatePath}`, err.message);
	}

	try {
		await fs.writeFileSync(cssTemplatePath, '', utf8);
	} catch (err) {
		console.error(`error creating file ${cssTemplatePath}`, err.message);
	}

	try {
		await fs.writeFileSync(webpackCommonPath, webpackCommonData, utf8);
	} catch (err) {
		console.error(`error creating file ${webpackCommonPath}:`, err.message);
	}

	try {
		await fs.writeFileSync(webpackProdPath, webpackProdData, utf8);
	} catch (err) {
		console.error(`error creating file ${webpackProdPath}:`, err.message);
	}

	try {
		await fs.writeFileSync(webpackDevPath, webpackDevData, utf8);
	} catch (err) {
		console.error(`error creating file ${webpackDevPath}:`, err.message);
	}

	updatePackageObjectProperty(
		'scripts',
		'dev',
		'webpack serve --open --config webpack.dev.js'
	);
	updatePackageObjectProperty(
		'scripts',
		'build',
		'webpack --config webpack.prod.js'
	);
}

export { setupWebpack };
