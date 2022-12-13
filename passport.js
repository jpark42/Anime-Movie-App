const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;


// Defining basic HTTP authentication for login requests to take a username and password from the request body and uses Mongoose to check your database for a user with the same username
// Keep in mind that the password doesn't get checked here
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password.'});
    }

    console.log('finished');
    return callback(null, user);
  });
}));


// Authenticate users based on the JWT submitted alongside their request
passport.use(new JWTStrategy({
  //JWT is extracted from the header of the HTTP request
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // “Decret” key to verifies signature of the JWT. This verifies that the sender of the JWT (the client) is who it says it is—and also that the JWT hasn’t been altered
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));