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
  const user = User.findOne({ _id: req.params.id })
  console.log(this.user)
  if (req.isAuthenticated()) {
    next()
    return
  }
  req.flash('error', 'Ooops you must be an admin to do that');
  res.redirect('/');
}