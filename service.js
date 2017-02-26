const _ = require('lodash');
const path = require('path');
const config = require('config');
const Q = require('q');
const mockFileReader = require('./mockFileReader');

function getEnabledMocks() {
	const promises = _.map(config, (component, name) => {
		component.mockPath = path.resolve('./mocks/', name);
		return component;
	})
	.filter(component => !component.disabled)
	.map(component => {
		return mockFileReader.getMocks(component.mockPath).then(mocks => {
			return mocks.map(mock => {
				mock.port = component.port;
				mock.uri = component.path + mock.uri;
				return mock;
			});
		});
	});

	return Q.all(promises).then(mocks => _.flatten(mocks));
}

module.exports = {
	getEnabledMocks
};

