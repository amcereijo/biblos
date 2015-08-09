var environment = process.env.ENV_VARIABLE || 'development';
  config = require('./env/' + environment ),
  passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt'),
  USER = config.admin.user,
  PASS = config.admin.password,
  users = {};

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, users[id]);
});


passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
  },
  function(name, password, done) {
  	if(name === USER && password === PASS) {
  		var returnUser = {
            name: name,
            id: new Date().getMilliseconds()
          };
          users[returnUser.id] = returnUser;
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
  	} else {
  		return done(null, false, {
          message: 'Invalid login'
        });
  	}
  }
));
