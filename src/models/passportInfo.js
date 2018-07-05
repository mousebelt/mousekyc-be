const mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var passportInfoSchema = new Schema(
  {
    filename: String,

    // passport/id card infomation
    firstname: String,
    lastname: String,
    dob: Date,
    documentExpireDate: Date,
    nationalityCountry: String, // Country code
    documentId: String,

    created: Date,
    updatedAt: Date
  }
);

/**
 * Password hash middleware.
 */
passportInfoSchema.pre('save', function save(next) {
  const row = this;
  row.updatedAt = Date.now();
  next();
});

const PassportInfo = mongoose.model("PassportInfo", passportInfoSchema);
module.exports = PassportInfo;
