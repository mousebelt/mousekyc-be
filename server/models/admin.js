const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var adminSchema = new Schema({
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

  deactivated: {
    type: Boolean,
    default: false
  },
  updatedAt: Date
}, { timestamps: true });

/**
 * Password hash middleware.
 */
adminSchema.pre('save', function save(next) {
  const user = this;
  user.updatedAt = Date.now();
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
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
