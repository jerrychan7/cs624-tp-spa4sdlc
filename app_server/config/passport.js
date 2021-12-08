const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('Users');

passport.use(new LocalStrategy({
  usernameField: 'name'
}, (username, password, done) => {
  User.findOneAndUpdate({ name: username }, { updatedAt: Date.now() }, (err, user) => {
    if (err) return done(err);
    if (!user)
      return done(null, false, {
        message: 'Incorrect username.'
      });
    if (!user.validPassword(password))
      return done(null, false, {
        message: 'Incorrect password.'
      });
    return done(null, user);
  });
}));
