const _ = require("lodash");
const country = require("countryjs");

const UtilsModule = require("../modules/utils");

// get coins
exports.getCountries = (req, res) => {
  try {
    var all = country.all();

    var data = _.map(all, item => {
      return { name: item.name, alpha3: item.ISO.alpha3 };
    });
    data = _.filter(data, function (o) { return o.name && o.alpha3; });
    return res.json({ status: 200, msg: "success", data });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};

// get image base64 by filename
exports.getImageFile = async (req, res) => {
  const gfs = req.app.get("gfs");
  var filename = req.params.filename;

  try {
    var data = await UtilsModule.getImageDataFromGrid(gfs, filename);
    return res.json({ status: 200, msg: "success", data });
  } catch (error) {
    return res.json({ status: 400, msg: "Error !", data: error });
  }
}