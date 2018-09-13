
const router = require('express').Router();
const raw = require('./fromAWS/raw');
const Trades = require('./models/trades');
const isLoggedIn = require('./Authentication/verify');

router.get('/api/test', isLoggedIn, (req, res) => { // test session
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

router.post('/api/newtrade', isLoggedIn, (req, res) => {
  const newTrade = req.body;
  Trades.create(newTrade, (err, trade) => {
    if (err) throw err;
    res.json(trade);
  });
});

router.get('/api/getopentrades', isLoggedIn, (req, res) => {
  const traderGoogleId = req.user.google.id;
  Trades.find({ userId: traderGoogleId, tradeStatusOpen: true })
    .sort('-entry.date')
    .exec((err, openTrades) => {
      if (err) throw err;
      res.json(openTrades);
    });
});

module.exports = router;

