const bcrypt = require('bcrypt-nodejs');
// const crypto = require('crypto');
const mongoose = require('mongoose');
const constants = require('./constants');

const { Schema } = mongoose;

// create a schema
const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  firstname: String,
  lastname: String,
  phone: String,
  birthday: Date,
  country: String,
  state: String,
  city: String,
  address: String,
  zipcode: String,

  status: {
    type: String,
    default: constants.ADMIN_STATUS_NOT_VERIFIED
  },
  ownerConfirmToken: String,

  updatedAt: Date
}, { timestamps: true });

/**
 * Password hash middleware.
 */
adminSchema.pre('save', function save(next) {
  const user = this;
  user.updatedAt = Date.now();
  if(!user.isModified('password')) { return next(); }
  return bcrypt.genSalt(10, (err, salt) => {
    if(err) { return next(err); }
    return bcrypt.hash(user.password, salt, null, (e, hash) => {
      if(e) { return next(e); }
      user.password = hash;
      return next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
adminSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
