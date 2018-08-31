// uses google to authenticate via passport see also /Authentication_Config/ folder

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// authentication additional requirements
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


// configuration  for authentication===============================================================
const passportConfig = require('./passport');
const routeConfig = require('./routes.js');

module.exports = (app) => {
  passportConfig(passport); // pass passport for configuration

  // set up our express application
  app.use(logger('dev')); // log every request to the console
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.json()); // get information from html forms

  app.use(session({
    secret: process.env.SESSION_SECRET,
    // warning in node if this option is not included
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true,
  }));
  // initialize passport and set up session
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  // routes ======================================================================
  routeConfig(app, passport); // load our routes and pass in our app and fully configured passport
  // end authentication
};

