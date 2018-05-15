"use strict"
var express = require('express');
var path = require('path');

var app = express();

var raw = require('./fromAWS/raw')
var db = require('./models/db')
require('./Authentication/authserver')(app)//add authentication

app.get("/api/test",(req,res)=>{//test session 
  res.json(req.session)
})

app.get("/api/getraw",function(req,res){//raw data access route
  raw().then((response)=>{
    res.json(response)
  })
  .catch((err)=>{
    res.end(err)
  })
})


//server primary route
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
   res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
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