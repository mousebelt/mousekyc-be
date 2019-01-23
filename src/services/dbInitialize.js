const config = require('../config');
const demoAdminInfo = require('../config/demo_admin');
const adminModel = require('../models/admin');

const demoAdminCreate = () => {
  adminModel.findOne({ email: demoAdminInfo.email })
    .then(row => {
      if (row) return;

      new adminModel(demoAdminInfo).save()
        .then(result => { // eslint-disable-line
          console.log('demo admin created.');
        })
        .catch(err => {
          console.log('error in saving demo admin.', err);
        });
    })
    .catch(err => {
      console.log('error in creating demo admin.', err);
    });
};

module.exports = function () {
  if (config.demoMode) demoAdminCreate();
};
