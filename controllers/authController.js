const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login',
  successRedirect: '/',
  successFlash: 'You\'ve logged in'
})

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
}

exports.isAdminLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin == true) {
    next()
    return
  }
  req.flash('error', `You don't have access`);
  res.redirect('back');
}

