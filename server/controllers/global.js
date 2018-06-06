const _ = require("lodash");
const country = require("countryjs");

// get coins
exports.getCountries = (req, res) => {
  try {
    var all = country.all();

    var data = _.map(all, item => {
      return { name: item.name, alpha3: item.ISO.alpha3 };
    });
    console.log(data);
    return res.json({ status: 200, msg: "success", data });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};
