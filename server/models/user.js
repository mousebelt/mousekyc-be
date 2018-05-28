const mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    token: String,
    tokenExpireDate: Date,
  
    phone: String,
    dob: Date,
    nationalityCountry: String, // Country code
    residenceCountry: String, // Country code
    residenceAddress: String,
    identityDocument: String, // photo in blobstore
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
