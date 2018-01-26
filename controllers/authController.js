import { promisify } from 'util';

const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto =require('crypto');
const promisify =require('es6-promisify');

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

exports.forgot = async (req, res) => {
  const user = await User.findOne({email: req.body.email})
  if(!user) {
    req.flash('error', 'Seems there was an issue');
    return res.redirect('/login');
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // this works out to 1 hr from now
  await user.save();
  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`
  req.flash('success', `You've been emailed a password link`);
  re.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if(!user) {
    req.flash('error', 'Password reset is invalid or has expired')
    res.redirect('/')
  }
  res.render('reset', { title: 'Reset your password' })
}

exports.confirmedPasswords = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if(!user) {
    req.flash('error', 'Password reset is invalid or has expired')
    res.redirect('/')
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset')
  res.redirect('/')
}