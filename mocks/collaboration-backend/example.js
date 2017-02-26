let counter = 0;

module.exports = [{
	method: 'GET',
	uri: '/dynamic-mock-example',
	handler: (req, res) => {
		counter++;
		res.send(`Counter: ${counter}`);
	}
}, {
	method: 'GET',
	uri: '/dynamic-parameterized-example/:name',
	handler: (req, res) => {
		res.send({
			Name: `${req.params.name}`
		});
	}
}];
