const mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema(
  {
    email: { type: String, unique: true },
    token: String,
    tokenExpireDate: Date,

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
      default: "PASSPORT"
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
 * Presave handle
 */
userSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
