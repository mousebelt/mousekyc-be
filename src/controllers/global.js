const _ = require('lodash');
const country = require('countryjs');

const UtilsModule = require('../modules/utils');

// get coins
exports.getCountries = (req, res) => {
  try {
    const all = country.all();
    let data = _.map(all, item => ({ name: item.name, alpha3: item.ISO.alpha3 }));
    data = _.filter(data, o => (o.name && o.alpha3));
    return res.json({ status: 200, msg: 'success', data });
  } catch(error) {
    return res.json({ status: 400, msg: 'Error occurred !' });
  }
};

// get image base64 by filename
exports.getImageFile = async (req, res) => {
  const gfs = req.app.get('gfs');
  const { filename } = req.params;

  try {
    const data = await UtilsModule.getImageDataFromGrid(gfs, filename);
    return res.json({ status: 200, msg: 'success', data });
  } catch(error) {
    return res.json({ status: 400, msg: 'Error occurred !' });
  }
};
