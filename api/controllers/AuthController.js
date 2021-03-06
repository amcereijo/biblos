/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
	_config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    login: function(req, res) {

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
            	console.log('error!!');

				return res.redirect('/login');

                /*return res.send({
                    message: info.message,
                    user: user
                });*/
            }
            req.logIn(user, function(err) {
                if (err){
                	console.log('error login!! - %s', err);
                	return res.render('login.ejs');
                	//res.send(err);
                }
                return res.redirect('/admin');
                /*return res.send({
                    message: info.message,
                    user: user
                });*/
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }

};

