const {mockServer} = require('http-mockserver');
const service = require('./service');

const enabledComponents = service.getEnabledComponents();
const mockFilenames = service.getFilenames(enabledComponents);

mockServer
    .addMocks(mockFilenames)
    .start();
