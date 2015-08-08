'use strict';

/**
Service to comunicate via http-server with parse platform www.parse.com
*/
var environment = process.env.ENV_VARIABLE || 'development';
var config = require('../../../config/env/' + environment );
var parseConfig = config.parse;
var http = require('https');

function sendNotification(notification) {
	console.log('notification.order: %s', JSON.stringify(notification.order));

	
	var d = new Date(notification.order.createdAt);
	var stringDate = [d.getHours(), ':', 
			(d.getMinutes()<10? '0'+d.getMinutes():d.getMinutes()), 
			' del dia ',
			d.getUTCDate(), '/', (d.getUTCMonth() +1), '/', d.getUTCFullYear()].join('');
	
	var message = 'Nuevo pedido a las ' + stringDate;
	console.log('message: %s', message);
	
	notification.order.createdAt = stringDate;
	notification.order.updateddAt = stringDate;

	var encodedOrder = new Buffer(JSON.stringify(notification.order)).toString('base64');

	var pushObject = JSON.stringify({
		'where': {
          'deviceType': 'android'
        },
        'data': {
        	'title': 'Biblos - pedido',
        	'alert': message,
        	'uri': parseConfig.androidUri + '?order=' + encodedOrder
        }
	});

	var options = {
	  hostname: 'api.parse.com',
	  port: 443,
	  path: '/1/push',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': pushObject.length,
	    'X-Parse-Application-Id': parseConfig.appId,
  		'X-Parse-REST-API-Key': parseConfig.httpApiId
	  }
	};

	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(pushObject);
	req.end();
}

module.exports = {
	sendNotification: sendNotification
}


/*
curl -X POST \
  -H "X-Parse-Application-Id: czKBuh1GPPruFLnqn7TqRBrahOAz67Kpbq9wD1L3" \
  -H "X-Parse-REST-API-Key: bPGMbwzQmCgY9Any4CQV6qu6j5ic21pmOaaB6daw" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "android"
        },
        "data": {
          "alert": "Your suitcase has been filled with tiny robots!"
        }
      }' \
https://api.parse.com/1/push
*/