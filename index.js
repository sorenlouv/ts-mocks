const {mockServer} = require('http-mockserver');
const service = require('./service');
mockServer.enableDebug();

service.getEnabledMocks()
	.then(mocks => mockServer.addMocks(...mocks))
	.then(() => mockServer.start())
	.done();

