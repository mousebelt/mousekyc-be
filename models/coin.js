const mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var coinSchema = new Schema({
  name: String,
  currency: String,
  hasTokens: Boolean,
  components: [String],
  tokens: [{
    tokenName: String,
    ticker: String,
  }],
  livenetNode: String,
  testnetNode: String,
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
