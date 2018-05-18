"use strict"
var express = require('express');
var path = require('path');

var app = express();
var mainroute= require('./routes')
var db = require('./models/db')
require('./Authentication/authserver')(app)//add authentication

app.use(mainroute)
//server primary route
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', function(req, res){
   res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;