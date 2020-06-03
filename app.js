const express = require("express");
// const helmet = require("helmet");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const promisify = require("es6-promisify");
const flash = require("connect-flash");
const expressValidator = require("express-validator");
const routes = require("./routes/index");
const helpers = require("./helpers");
const errorHandlers = require("./handlers/errorHandlers");
require("./handlers/passport");
// const multer = require('multer')
// const upload = multer({dest: './uploads'})

const app = express();
// app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// serve up static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// parse raw json requests into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// expose methods for validating data. used a lot on userController.validateRegister
app.use(expressValidator());

// populate req.cookies with any cookies that came with a request
app.use(cookieParser());

// This keeps users logged in and allows sending of flash messages
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// user Passport JS for handling login
app.use(passport.initialize());
app.use(passport.session());

// setup of flash messages
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// handle routes
app.use("/", routes);
// if route didn't work handle 404
app.use(errorHandlers.notFound);
// handle flash message errors if it's just a vlidation error
app.use(errorHandlers.flashValidationErrors);
// this provides the error stack trace if 500 or something real bad
if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
}
// production error handling
app.use(errorHandlers.productionErrors);

module.exports = app;
