const _ = require('lodash');

const initiatorUser = {
	Id: 'd55dc1ad-3053-46eb-b0fd-dc8d9bdb2fe1',
	CompanyAccountId: '9a18fdc9-3d7c-44b2-a673-bbbb65f12f66',
	CompanyName: 'Sqren',
	Username: 'slo@tradeshift.com',
	Language: 'en-us',
	TimeZone: 'Europe/Berlin',
	Memberships: [{
		UserId: 'd55dc1ad-3053-46eb-b0fd-dc8d9bdb2fe1',
		GroupId: '9a18fdc9-3d7c-44b2-a673-bbbb65f12f66',
		Role: 'a6a3edcd-00d9-427c-bf03-4ef0112ba16d'
	}],
	Created: '2017-02-24T13:33:02.645+01:00',
	State: 'ACTIVE',
	Type: 'PERSON',
	FirstName: 'Søren',
	LastName: 'Louv',
	Visible: true
};

function getEvents(primarySubject, conversationName) {
	const audience = conversationName.split(',');
	const persistenceId = `conversation_${primarySubject}_${conversationName}`;

	return [{
		persistenceId: persistenceId,
		sequenceNumber: 1,
		timestamp: 1487950992348,
		initiatorUserId: initiatorUser.Id,
		type: 'conversationCreated',
		data: {
			title: '',
			initiatorUser: initiatorUser
		},
		primarySubject: primarySubject,
		audience: [audience],
		initiatorCompanyId: initiatorUser.CompanyAccountId
	}, {
		persistenceId: persistenceId,
		sequenceNumber: 2,
		timestamp: 1487950992365,
		initiatorUserId: initiatorUser.Id,
		type: 'messageAdded',
		data: {
			id: 0,
			body: 'This is a test message 2: ' + primarySubject,
			activity: 'hardcoded_activity',
			contentType: 'text/plain',
			otherSubjects: [],
			initiatorUser: initiatorUser
		},
		primarySubject: primarySubject,
		audience: [audience],
		initiatorCompanyId: initiatorUser.CompanyAccountId
	}];
}

function getConversations() {
	const primarySubject = 'collaboration/subjects/test2';
	const conversationName = '9a18fdc9-3d7c-44b2-a673-bbbb65f12f66';
	const persistenceId = `conversation_${primarySubject}_${conversationName}`;
	return [{
		persistenceId: persistenceId,
		unread: 0,
		data: {}
	}];
}

module.exports = [
	mock('GET', '/v2/conversations', {
		body: {
			conversations: getConversations()
		}
	}),
	// mock('HEAD', primarySubject, {}),
	mock('GET', '/v2/heartbeat', {}),
	mock('GET', `/v2/subjects/:primarySubject/conversations/:conversationName`, (req, res) => {
		if (!req.query.after) {
			res.send({
				events: getEvents(req.params.primarySubject, req.params.conversationName)
			});
			return;
		}

		setTimeout(() => {
			res.send({
				events: []
			});
		}, 10000);
	})
];

function mock(method, uri, payload) {
	const test = { method, uri };
	if (_.isFunction(payload)) {
		test.handler = payload;
	} else {
		test.response = payload;
	}
	return test;
}
