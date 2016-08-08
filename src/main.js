var irc = require('irc');
var request = require('request');

var ircClient = new irc.Client('irc.synyx.de', 'rocket-bot', {
	channels: ['#irchacks']
});

ircClient.addListener('error', function (message) {
	console.log('error: ', message);
});

console.log("IRC: Adding msg listener...");

ircClient.addListener('message', function (from, to, message) {

	console.log("IRC: msg listener invoked with: " + message);

	if (rocketAuthToken && rocketUserId) {

		console.log("sending msg");

		var options = {
			headers: {
				'X-Auth-Token': rocketAuthToken,
				'X-User-Id': rocketUserId
			},
			body: JSON.stringify({'msg': message})
		};

		request.post('http://rocketchat.synyx.coffee:8080/api/rooms/u4J45mZb4JNCLTKam/send', options,
			function (error, response, body) {
				console.log("send resp status: " + response.statusCode)
				console.log("send resp body: " + JSON.stringify(response))

			});
	}
})

var rocketAuthToken;
var rocketUserId;

request.post('http://rocketchat.synyx.coffee:8080/api/login', {
	'body': JSON.stringify({
		'user': 'bot2',
		'password': 'something'
	})
}, function (error, response, body) {
	if (!error && response.statusCode == 200) {

		console.log('auth succesful, response: ' + JSON.stringify(body));

		var responseObj = JSON.parse(body);

		rocketAuthToken = responseObj.data.authToken;
		rocketUserId = responseObj.data.userId;

		console.log('auth succesful: ' + rocketAuthToken + ', ' + rocketUserId);

		request.get('http://rocketchat.synyx.coffee:8080/api/publicRooms',
			{
				headers: {
					'X-Auth-Token': rocketAuthToken,
					'X-User-Id': rocketUserId
				},
			}, function (error, response, body) {
				console.log('public room response: ' + JSON.stringify(response));
			});

		var options = {
			url: 'http://rocketchat.synyx.coffee:8080/api/rooms/u4J45mZb4JNCLTKam/join',
			headers: {
				'X-Auth-Token': rocketAuthToken,
				'X-User-Id': rocketUserId
			}
		};

		request.post(options, function (error, response, body) {
			console.log('join response: ' + JSON.stringify(response));
		});
	} else {
		console.log('auth error: ' + error);
		//console.log('status:' + response.statusCode);
		console.log('response:' + JSON.stringify(response));

	}
})