const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  google: String,
  paypal: String,
  amazon: String,
  linkedin: String,
  skrill: String,
  tokens: [{

  }],
  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },

  admin: Boolean,

  firstname: String,
  lastname: String,
  phone: String,
  birthday: Date,
  country: String,
  state: String,
  city: String,
  address: String,
  zipcode: String,

  /*
  ** 0: not ready
  ** 1: waiting approval
  ** 2: completed
  **/
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },

  twoFactor: {
    type: Boolean,
    default: false
  },

  baseCurrency: {
    type: String,
    default: 'USD'
  },

  deactivated: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
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
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
