// main authentication router
module.exports = function(app, passport) {

    //wether a user is logged in or not json data will show up on the profile page
    app.get('/auth/profile', isLoggedIn, function(req, res) {
      let headerObject = req.headers //need for ip
      let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
      ip = (ip === "::1") ? "local" : ip
      res.json({
                authenticated: true,
                userip: ip,
                username: req.user.google.id,
                displayname: req.user.google.displayName
            });
    });
    // route for logging out
    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    //app.get('/auth/google', passport.authenticate('google'));
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
      }));
    // handle the callback after twitter has authenticated the user, just go back to home in my case
    app.get('/auth/google/redirect',
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

};

// route middleware, the main function that checks if a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
          return next();
    }
    // if they aren't populate the profile page accordingly
    let headerObject = req.headers
     //the x-forwarded-for property of the header does not appear for local host so add an alternative or will
     //error out locally on split to get the ip address the rest of the requests are common to loacl and remote
    let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
    ip = (ip === "::1") ? "local" : ip
    res.json({
      authenticated: false,
      userip: ip,
      username: null,
      displayname: null
    });
}
