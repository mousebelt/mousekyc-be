var UserModel = require("../models/user");
var UtilsModule = require("../modules/utils");

exports.postAdd = async (req, res) => {
  var {
    name,
    email,
    phone,
    dob,
    nationalityCountry,
    residenceCountry,
    residenceAddress,
    // identityDocument,
    // selfie,
    adminContact,
    checkStatus,
    adminMessage,
    backgroundCheckId
  } = req.body;

  // validation
  if (!name || name == "")
    return res.json({ status: 400, msg: "Empty name !" });
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!phone || phone == "")
    return res.json({ status: 400, msg: "Empty phone !" });
  if (!dob || dob == "") return res.json({ status: 400, msg: "Empty dob !" });
  if (!nationalityCountry || nationalityCountry == "")
    return res.json({ status: 400, msg: "Empty nationalityCountry !" });
  if (!residenceCountry || residenceCountry == "")
    return res.json({ status: 400, msg: "Empty residenceCountry !" });
  if (!residenceAddress || residenceAddress == "")
    return res.json({ status: 400, msg: "Empty residenceAddress !" });
  if (!adminContact || adminContact == "")
    return res.json({ status: 400, msg: "Empty adminContact !" });
  // if (!checkStatus || checkStatus == "")
  //   return res.json({ status: 400, msg: "Empty checkStatus !" });
  if (!adminMessage || adminMessage == "")
    return res.json({ status: 400, msg: "Empty adminMessage !" });
  if (!backgroundCheckId || backgroundCheckId == "")
    return res.json({ status: 400, msg: "Empty backgroundCheckId !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (userRow)
      return res.json({ status: 400, msg: "Already existing user !" });

    // Add user
    userRow = new UserModel({
      name,
      email,
      phone,
      dob,
      nationalityCountry,
      residenceCountry,
      residenceAddress,
      // identityDocument,
      // selfie,
      adminContact,
      checkStatus,
      adminMessage,
      backgroundCheckId
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};

exports.postUpdate = async (req, res) => {
  var {
    name,
    email,
    phone,
    dob,
    nationalityCountry,
    residenceCountry,
    residenceAddress,
    // identityDocument,
    // selfie,
    adminContact,
    checkStatus,
    adminMessage,
    backgroundCheckId
  } = req.body;

  // validation
  if (!name || name == "")
    return res.json({ status: 400, msg: "Empty name !" });
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!phone || phone == "")
    return res.json({ status: 400, msg: "Empty phone !" });
  if (!dob || dob == "") return res.json({ status: 400, msg: "Empty dob !" });
  if (!nationalityCountry || nationalityCountry == "")
    return res.json({ status: 400, msg: "Empty nationalityCountry !" });
  if (!residenceCountry || residenceCountry == "")
    return res.json({ status: 400, msg: "Empty residenceCountry !" });
  if (!residenceAddress || residenceAddress == "")
    return res.json({ status: 400, msg: "Empty residenceAddress !" });
  if (!adminContact || adminContact == "")
    return res.json({ status: 400, msg: "Empty adminContact !" });
  // if (!checkStatus || checkStatus == "")
  //   return res.json({ status: 400, msg: "Empty checkStatus !" });
  if (!adminMessage || adminMessage == "")
    return res.json({ status: 400, msg: "Empty adminMessage !" });
  if (!backgroundCheckId || backgroundCheckId == "")
    return res.json({ status: 400, msg: "Empty backgroundCheckId !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (!userRow) return res.json({ status: 400, msg: "User not found !" });

    // Add user
    userRow.set({
      name,
      email,
      phone,
      dob,
      nationalityCountry,
      residenceCountry,
      residenceAddress,
      // identityDocument,
      // selfie,
      adminContact,
      checkStatus,
      adminMessage,
      backgroundCheckId
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};
