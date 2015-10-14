var cliParams = require('./cliParams');

/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

console.log('Production start with: ', process.env);
module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

  // parse platform
  parse: {
    appId: process.env.appId,
    httpApiId: process.env.httpApiId,
    androidUri: 'biblos://order'
  },
  admin: {
    user: '',
    password: ''
  }

};

 //sails lift appId=czKBuh1GPPruFLnqn7TqRBrahOAz67Kpbq9wD1L3 httpApiId: httpApiId=bPGMbwzQmCgY9Any4CQV6qu6j5ic21pmOaaB6daw
