// uses google to authenticate via passport see also /Authentication_Config/ folder
const passport = require('passport');
// configuration  for authentication===============================================================
const passportConfig = require('./passport');
const routeConfig = require('./routes.js');

module.exports = (app) => {
  passportConfig(passport); // pass passport for configuration
  // initialize passport and set up session
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  // routes ======================================================================
  routeConfig(app, passport); // load our routes and pass in our app and fully configured passport
  // end authentication
};
