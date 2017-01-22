const fs = require('fs');
const path = require('path');

function getComponentsConfig() {
	const CONFIG_FILENAME = './componentsConfig.json';
	const DEFAULT_COMPONENTS_CONFIG = {
		'collaboration-backend': true
	};

	// Create file if it doesn't exist
	try {
		fs.writeFileSync(CONFIG_FILENAME, JSON.stringify(DEFAULT_COMPONENTS_CONFIG, null, 4), { flag: 'wx' });
		return DEFAULT_COMPONENTS_CONFIG;
	} catch (e) {
		return require(CONFIG_FILENAME);
	}
}

function getEnabledComponents() {
	const componentsConfig = getComponentsConfig();
	return Object.keys(componentsConfig).filter(name => componentsConfig[name]);
}

function getFilenames(components) {
	return components.map(name => path.resolve('./mocks/', name));
}

module.exports = {
	getEnabledComponents,
	getFilenames
};

