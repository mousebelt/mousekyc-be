const mongoose = require('mongoose');

const { Schema } = mongoose;

// create a schema
const passportInfoSchema = new Schema(
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

const PassportInfo = mongoose.model('PassportInfo', passportInfoSchema);
module.exports = PassportInfo;
