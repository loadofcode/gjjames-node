
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');


exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login'});
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register'});
}

exports.addUser = (req, res) => {
  res.render('editUser', {title: 'Add New User'});
}

exports.validateRegister = (req, res, next) => {
  // validation middleware for our app
  req.sanitizeBody('name'); // sanitizeBody uses express-validator - check their docs for more info
  req.checkBody('name', 'You must supply a name').notEmpty();
  req.checkBody('email', 'You must supply a email').isEmail();
  req.sanitizeBody('email').normalizeEmail({ //check validator.js for more info on normalizeEmail
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {title: 'Register', body: req.body, flashes:req.flash() });
    return; //stops function from running
  }
  next(); // there were no errors - so saves user to DB i.e. calls next middleware
};

exports.register = async (req, res, next) => {
  const user = new User({email: req.body.email, name: req.body.name});
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  next() // passes to authcontroller.login

}