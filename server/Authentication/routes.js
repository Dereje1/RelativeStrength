// main authentication router
const isLoggedIn = require('./verify');

module.exports = (app, passport) => {
  // wether a user is logged in or not json data will show up on the profile page
  app.get('/auth/profile', isLoggedIn, (req, res) => {
    const headerObject = req.headers; // need for ip
    let ip = (headerObject['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0];
    ip = (ip === '::1') ? 'local' : ip;
    res.json({
      authenticated: true,
      userip: ip,
      username: req.user.google.id,
      displayname: req.user.google.displayName,
    });
  });
  // route for logging out
  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));
  // handle the callback after twitter has authenticated the user, just go back to home in my case
  app.get('/auth/google/redirect', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
  }));
};
