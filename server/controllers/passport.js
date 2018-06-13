const passport = require("passport");
const request = require("request");
const LocalStrategy = require("passport-local").Strategy;
const AdminModel = require("../models/admin");
const UserModel = require("../models/user");
const UtilsModule = require("../modules/utils");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  "admin",
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    AdminModel.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: `Invalid email !` });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid password !" });
      });
    });
  })
);

passport.use(
  "user",
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
console.log({email, password})    
    UserModel.findOne({ email: email.toLowerCase() }, (err, user) => {
console.log({user, err})      
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: `Invalid email !` });
      }
      user.comparePassword(password, (err, isMatch) => {
        console.log({err, isMatch})
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid password !" });
      });
    });
  })
);
