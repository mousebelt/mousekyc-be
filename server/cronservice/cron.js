var CoinModel = require('../models/coin');

const initCoins = function () {
  CoinModel.find({}, (err, rows) => {
    if (err) { console.log('Coin DB error !') }

    if (!rows || rows.length === 0) {
      try {
        var coins = [
          {
            name: 'Bitcoin',
            currency: 'BTC',
            hasTokens: false,
            components: ['blocks', 'txns'],
            tokens: [],
            livenetNode: 'http://35.173.152.54:8001',
            testnetNode: 'http://35.173.152.54:8001',
          },

          {
            name: 'Ethereum',
            currency: 'ETH',
            hasTokens: true,
            components: ['blocks', 'txns'],
            tokens: [
              { tokenName: 'TRONix', ticker: 'TRON' },
              { tokenName: 'VeChain', ticker: 'VEN' },
              { tokenName: 'Binance Coin', ticker: 'BNB' },
              { tokenName: 'OmiseGO', ticker: 'OMG' },
              { tokenName: 'Zilliqa', ticker: 'ZIL' },
            ],
            livenetNode: 'http://18.232.254.235',
            testnetNode: 'http://18.232.254.235',
          },

          {
            name: 'Litecoin',
            currency: 'LTC',
            hasTokens: false,
            components: ['blocks', 'txns'],
            tokens: [],
            livenetNode: 'http://18.205.122.159:2001',
            testnetNode: 'http://18.205.122.159:2001',
          },

          {
            name: 'NEO',
            currency: 'NEO',
            hasTokens: true,
            components: ['blocks', 'txns'],
            tokens: [
              { tokenName: 'lrnToken', ticker: 'LRN' },
              { tokenName: 'Trinity Network Credit', ticker: 'TNC' },
              { tokenName: 'Qlink Token', ticker: 'QLC' },
              { tokenName: 'Orbis', ticker: 'OBT' },
              { tokenName: 'THKEY', ticker: 'TKY' },
            ],
            livenetNode: 'http://18.205.122.159:8001',
            testnetNode: 'http://18.205.122.159:8001',
          },

          {
            name: 'Stellar',
            currency: 'XLM',
            hasTokens: true,
            components: ['ledgers', 'txns', 'operations'],
            tokens: [
              { tokenName: 'Mobius', ticker: 'MOBI' },
              { tokenName: 'Repocoin', ticker: 'REPO' },
              { tokenName: 'Firefly', ticker: 'XCN' },
              { tokenName: 'Diruna', ticker: 'DRA' },
              { tokenName: 'Smartlands', ticker: 'SLT' },
            ],
            livenetNode: 'http://18.205.122.159:2000',
            testnetNode: 'http://18.205.122.159:2000',
          },
        ];
        CoinModel.insertMany(coins);
        console.log('created coin collection !');
      } catch (e) {
        console.log('error in creating coin collecetion !', e);
      }
    }
  })
}

function initDB() {
  initCoins();
}

exports.start = function () {
  console.log('cron started !');
  initDB();
}