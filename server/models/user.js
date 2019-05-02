//  for new users
// load the things we need
const mongoose = require('mongoose');
// define the schema for our user model
const userSchema = mongoose.Schema({
  google: {
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
});

// create the model for users and export
module.exports = mongoose.model('User', userSchema);
