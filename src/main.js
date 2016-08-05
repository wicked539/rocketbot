var irc = require('irc');
var request = require('request');

var ircClient = new irc.Client('irc.synyx.de', 'rocket-bot', {
    channels: ['#irchacks']
});

ircClient.addListener('error', function(message) {
    console.log('error: ', message);
});

console.log("IRC: Adding msg listener...");

ircClient.addListener('message', function (from, to, message) {

	console.log("IRC: msg listener invoked with: " + message);

	if (rocketAuthToken && rocketUserId) {
		var options = {
          url: 'http://rocketchat.synyx.coffee:8080/api/rooms/GENERAL/join',
          headers: {
            'X-Auth-Token': rocketAuthToken,
            'X-User-Id': rocketUserId
          },
          method: 'post',
  			body: { 'msg': message},
  json: true
  
        };

        request.post(options);
    }

	/*
curl -H "X-Auth-Token: S5u0ZNNbc5W6Qqug90JdWRT2sxEWgz9mR5mu2dWOQ5v" \
     -H "Content-Type: application/json" \
     -X POST \
     -H "X-User-Id: aobEdbYhXfu5hkeqG" \
        http://localhost:3000/api/rooms/x4pRahjs5oYcTYu7i/send \
     -d "{ \"msg\" : \"OK\" }"
	*/
})

var rocketAuthToken;
var rocketUserId;

request.post('http://rocketchat.synyx.coffee:8080/api/login', {
	'auth': {
      'user': 'bot2',
      'pass': 'something'
    }
  }, function (error, response, body) {
  if (!error && response.statusCode == 200) {

console.log('auth succesful...');

  	rocketAuthToken = body.data.authToken;
  	rocketUserId = body.data.userId;

  	    console.log('auth succesful: ' +  rocketAuthToken + ', ' + rocketUserId);

  	var options = {
      url: 'http://rocketchat.synyx.coffee:8080/api/rooms/GENERAL/join',
      headers: {
        'X-Auth-Token': rocketAuthToken,
        'X-User-Id': rocketUserId
      }
    };

    request.get(options, function() {
    	console.log('join succesful');
    });
  } else {
  	    console.log('auth error: ' + error);
  }
})