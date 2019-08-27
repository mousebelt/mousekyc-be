const mongoose = require('mongoose');

const { Schema } = mongoose;

// create a schema
const userSchema = new Schema(
  {
    email: { type: String, unique: true },

    token: String,
    tokenExpire: Date,

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
      default: 'PASSPORT',
    },
    identityDocument: String, // photo in blobstore

    phone: String,
    residenceCountry: String, // Country code
    residenceAddress: String,
    selfie: String, // photo in blobstore

    approvalStatus: {
      type: String,
      // enum: ['NO_SUBMISSION_YET', PENDING', 'APPROVED', 'ACTION_REQUESTED', 'BLOCKED'],
      default: 'NO_SUBMISSION_YET'
    },
    approvalDescription: String, // ex: "Please submit a clearer selfie, identity is not clear from photo"

    adminContact: String,
    checkStatus: String,
    adminMessage: String,
    backgroundCheckId: String,
    created: Date,
    updatedAt: Date
  }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  user.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
