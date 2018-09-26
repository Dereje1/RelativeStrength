
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

router.get('/api/getclosedtrades', isLoggedIn, (req, res) => {
  const traderGoogleId = req.user.google.id;
  Trades.find({ userId: traderGoogleId, tradeStatusOpen: false })
    .sort('-entry.date')
    .exec((err, closedTrades) => {
      if (err) throw err;
      res.json(closedTrades);
    });
});

router.put('/api/movestop', (req, res) => {
  const { tradeId, newStop } = req.body;
  Trades.findByIdAndUpdate(tradeId, { stop: newStop }, { new: true }, (err, updated) => {
    if (err) throw err;
    res.json(updated);
  });
});

router.put('/api/closetrade', (req, res) => {
  const { tradeId, exitInfo } = req.body;
  Trades.findByIdAndUpdate(
    tradeId,
    { tradeStatusOpen: false, exit: exitInfo },
    { new: true },
    (err, updated) => {
      if (err) throw err;
      res.json(updated);
    },
  );
});
module.exports = router;
