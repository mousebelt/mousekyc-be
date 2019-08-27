const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ModelConstants = require('../models/constants');
const AdminModel = require('../models/admin');
const UserModel = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  'admin',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    AdminModel.findOne({ email: email.toLowerCase() }, (err, user) => {
      if(err) return done(err);
      if(!user) return done(null, false, { msg: 'email not found' });
      if(user.status !== ModelConstants.ADMIN_STATUS_VERIFIED) return done(null, false, { msg: 'Not verified user !' });

      return user.comparePassword(password, (e, isMatch) => {
        if(e) return done(e);
        if(isMatch) return done(null, user);
        return done(null, false, { msg: 'Invalid password !' });
      });
    });
  })
);

passport.use(
  'user',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    UserModel.findOne({ email: email.toLowerCase() }, (err, user) => {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { msg: 'email not found' });
      }
      return user.comparePassword(password, (e, isMatch) => {
        if(e) return done(e);
        if(isMatch) return done(null, user);
        return done(null, false, { msg: 'Invalid password !' });
      });
    });
  })
);
