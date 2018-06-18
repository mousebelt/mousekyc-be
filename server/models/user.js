const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema(
  {
    email: { type: String, unique: true },
    password: String,
    default_password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // passport/id card infomation
    firstname: String,
    lastname: String,
    dob: Date,
    documentExpireDate: Date,
    nationalityCountry: String, // Country code
    documentId: String,
    documentType: {
      type: String,
      enum: ['PASSPORT', 'IDCARD'],
      default: "PASSPORT",
    },
    identityDocument: String, // photo in blobstore

    phone: String,
    residenceCountry: String, // Country code
    residenceAddress: String,
    selfie: String, // photo in blobstore

    approvalStatus: {
      type: String,
      // enum: ['NO_SUBMISSION_YET', PENDING', 'APPROVED', 'ACTION_REQUESTED', 'BLOCKED'],
      default: "NO_SUBMISSION_YET"
    },
    approvalDescription: String, // ex: "Please submit a clearer selfie, identity is not clear from photo"

    adminContact: String,
    checkStatus: String,
    adminMessage: String,
    backgroundCheckId: String,
    created: Date,
    updatedAt: Date
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
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
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
