'use strict';

/**
Service to comunicate via http-server with parse platform www.parse.com
*/
var environment = process.env.ENV_VARIABLE || 'development';
var config = require('../../../config/env/' + environment );
var parseConfig = config.parse;
var http = require('https');


function createdFormartedDate(order) {
	var d = new Date(order.createdAt),
		formatedDate = [d.getHours(), ':', 
			(d.getMinutes()<10? '0'+d.getMinutes():d.getMinutes()), 
			' del dia ',
			d.getUTCDate(), '/', (d.getUTCMonth() +1), '/', d.getUTCFullYear()].join('');

	return formatedDate;
}

function createPushObject(order) {
	var formatedDate = createdFormartedDate(order),
		message = 'Nuevo pedido a las ' + formatedDate,
		encodedOrder,
		pushObject;

	console.log('message: %s', message);
	order.createdAt = formatedDate;
	order.updateddAt = formatedDate;

	encodedOrder = new Buffer(JSON.stringify(order)).toString('base64');

	pushObject = JSON.stringify({
		'where': {
          'deviceType': 'android'
        },
        'data': {
    	'title': 'Biblos - pedido',
        	'alert': message,
        	'uri': parseConfig.androidUri + '?order=' + encodedOrder
        }
	});
	return pushObject;
}

function sendNotification(notification) {
	
	var pushObject,
		options,
		req;

	pushObject = createPushObject(notification.order);

	options = {
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

	req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.write(pushObject);
	req.end();
}

module.exports = {
	sendNotification: sendNotification
}
