const mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    dob: Date,
    nationalityCountry: String, // Country code
    residenceCountry: String, // Country code
    residenceAddress: String,
    identityDocument: String, // photo in blobstore
    selfie: String, // photo in blobstore
    approvalStatus: {
      type: String,
      // enum: ['Pending', 'Reject', 'Passed'],
      default: "Pending"
    },
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
