const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
  userId: { type: String, required: true },
  tradeStatusOpen: { type: Boolean, required: true }, // true = Open
  symbol: { type: String, required: true },
  long: { type: Boolean, required: true }, // true = long
  stop: { type: Number, required: true },
  entry: {
    type: [{
      date: { type: Number, required: true },
      size: { type: Number, required: true },
      price: { type: Number, required: true },
      comments: { type: String, required: true },
    }],
    required: true,
  },
  exit: [
    {
      date: { type: Number, required: true },
      size: { type: Number, required: true },
      price: { type: Number, required: true },
      comments: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Trade', tradeSchema);
