// Dependencies
let createError = require('http-errors'); // Handles HTTP errors
let express = require('express'); // Main Express framework
let path = require('path'); // Handles file paths
let cookieParser = require('cookie-parser'); // Parses cookies
let logger = require('morgan'); // Logs HTTP requests
let session = require('express-session'); // Session management
let flash = require('connect-flash'); // Flash messages for errors
let mongoose = require('mongoose'); // MongoDB ODM
let userModel = require('../model/users');
let User = userModel.User;
let passport = require('passport'); // Authentication middleware
let passportLocal = require('passport-local')
passport.use(User.createStrategy());
let localStrategy = passportLocal.Strategy;


// Routers
let indexRouter = require('../routes/index'); // Main routes
let usersRouter = require('../routes/users'); // User-related routes
let surveyRouter = require('../routes/survey'); // Survey-related routes

// MongoDB connection details
let DB = require('./db');

// Initialize Express app
let app = express();

// Connect to MongoDB
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error'))
mongoDB.once('open',()=>{
  console.log('MongoDB Connected')
})
mongoose.connect(DB.URI,{useNewURIParser:true,
  useUnifiedTopology:true
})

// View engine setup
app.set('views', path.join(__dirname, '../views')); // Views directory
app.set('view engine', 'ejs'); // Set EJS as view engine

// Middleware
app.use(logger('dev')); // Log HTTP requests
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files
app.use(express.static(path.join(__dirname, '../node_modules'))); // Serve node_modules

// Session configuration
app.use(session({
  secret: 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: false
}));


// Flash messages
app.use(flash());
// serlize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

// Set user and flash messages for all views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Pass user info to views
  res.locals.success_msg = req.flash('success_msg'); // Flash success messages
  res.locals.error_msg = req.flash('error_msg'); // Flash error messages
  res.locals.error = req.flash('error'); // Flash general errors
  next();
});

// Route setup
app.use('/', indexRouter); // Main routes
app.use('/users', usersRouter); // User-related routes (if used)
app.use('/surveys', surveyRouter); // Survey-related routes

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404)); // Create a 404 error for unmatched routes
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error details in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' }); // Render error view
});

module.exports = app;
