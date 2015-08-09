/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var parseService = require('../services/parseService/ParseService');

module.exports = {

  attributes: {
  	products: {
  		type: 'array',
  		required: true
  	},
  	clientName: {
  		type: 'string',
  		required: true
  	},
  	comments: {
  		type: 'string'
  	}
  },

  afterCreate: function(order, cb) {
  		parseService.sendNotification({order: order});
  		console.log('Just created an order:' + JSON.stringify(order));
      cb();
    }

};

