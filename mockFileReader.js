const Q = require('q');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const readDir = require('recursive-readdir');

const mockFileReader = {};

function getFiles(dirname) {
	return Q.Promise((resolve, reject) => {
		readDir(dirname, (err, filenames) => {
			if (err) {
				reject(err);
				return;
			}

			const files = filenames
				.filter(filename => ['.json', '.js'].includes(path.extname(filename)))
				.map(getFile);

			resolve(files);
		});
	});
}

function getFile(filename) {
	try {
		return {
			name: filename,
			content: require(path.resolve(filename))
		};
	} catch (e) {
		console.error(`Error loading ${filename}`, e);
		throw e;
	}
}

function parseFile(filename, mockConfigs) {
	return Array.isArray(mockConfigs) ? mockConfigs : [mockConfigs];
}

mockFileReader.getMocks = function(filePaths = []) {
	filePaths = Array.isArray(filePaths) ? filePaths : [filePaths];

	const promises = filePaths.map(filePath => {
		let isFile;
		try {
			isFile = fs.lstatSync(filePath).isFile();
		} catch (e) {
			console.error(`${filePath} does not exist`);
			return [];
		}

		if (isFile) {
			const file = getFile(filePath);
			return parseFile(file.name, file.content);
		}
		return getFiles(filePath)
			.then(files => {
				return files.map(file => parseFile(file.name, file.content));
			})
			.catch(err => {
				console.error(`Error loading files ${filePath}`, err);
			});
	});

	return Q.all(promises).then(mocks => _.flattenDeep(mocks));
};

module.exports = mockFileReader;
