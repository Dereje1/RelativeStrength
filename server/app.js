const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const app = express();
// custom requirements
const apiRoutes = require('./routes');
const dbConnect = require('./models/db');
const authentication = require('./Authentication/authserver');

// server primary build route
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(cookieSession({
  maxAge: 21 * 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET],
}));

dbConnect(process.env.MONGOLAB_URI);
authentication(app); // Pass app for authentication configuration
app.use(apiRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
