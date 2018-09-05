
const router = require('express').Router();
const raw = require('./fromAWS/raw');
const User = require('./models/user');
const Trades = require('./models/trades');

const verification = (req, res, next) => {
  const requestingUserID = req.query.googleid;
  const passportSessionUserId = Object.keys(req.session.passport).length === 0 ? null
    : req.session.passport.user;

  if (passportSessionUserId) {
    User.findById(passportSessionUserId, (err, user) => {
      if (err) throw err;
      if (requestingUserID === String(user._id)) return next();
      res.end('Authentication can not be Verified!!');
      return null;
    });
  } else {
    res.end('Not Authenticated!!');
  }
};

router.get('/api/test', verification, (req, res) => { // test session
  res.json(req.session);
});

router.get('/api/getraw', (req, res) => { // raw data access route
  raw().then((response) => {
    res.json(response);
  })
    .catch((err) => {
      res.end(err);
    });
});

router.post('/api/newtrade', (req, res) => {
  const newTrade = req.body;
  Trades.create(newTrade, (err, trade) => {
    if (err) throw err;
    res.json(trade);
  });
});
module.exports = router;

