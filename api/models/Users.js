/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	displayName: {
  		type: 'string',
  		required: false
  	},
  	name: {
  		type: 'string',
  		required: true
  	},
  	password: {
  		type: 'string',
  		required: true
  	}
  }
};

