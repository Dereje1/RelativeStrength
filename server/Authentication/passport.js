// config/passport.js

// load all the things we need
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
const User = require('../models/user');

module.exports = (passport) => {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // =========================================================================
  // Google =================================================================
  // =========================================================================
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
    },
    (token, tokenSecret, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'google.id': profile.id }, (err, user) => {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
          if (err) return done(err);

          // if the user is found then log them in
          if (user) {
            return done(null, user); // user found, return that user
          }
          // if there is no user, create them
          const newUser = new User();

          // set all of the user data that we need
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.email = profile.emails[0].value;
          newUser.google.displayName = profile.displayName;

          // save our user into the database
          newUser.save((errSave) => {
            if (errSave) throw errSave;
            return done(null, newUser);
          });

          return null;
        });
      });
    },
  ));
};
