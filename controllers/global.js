var CoinModel = require('../models/coin');

// get coins
exports.getCoins = (req, res) => {
  try {
    CoinModel.find({}, (e, rows) => {
      if (e) {
        return res.json({ status: 400, msg: 'Error in finding coins !', data: e });
      }
      return res.json({ status: 200, msg: 'success', data: rows });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'DB is not working !', data: error });
  }
}
