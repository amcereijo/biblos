var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, users[id]);
    /*User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });*/
});
var USER = 'admin', PASS = 'admin';
var users = {};

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


/*

    User.findOne({ name: name }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect name.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            name: user.name,
            createdAt: user.createdAt,
            id: user.id,
            displayName: user.displayName
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
    });
*/
  }
));
