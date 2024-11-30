const passport = require('passport'); // Import Passport.js for authentication
const LocalStrategy = require('passport-local').Strategy; // Import LocalStrategy for username/password authentication
const { User } = require('../model/users'); // Import the User model with passport-local-mongoose integration

// Use the LocalStrategy provided by passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate())); // Automatically uses the authenticate method added by passport-local-mongoose

// Serialize the user to store the user ID in the session
passport.serializeUser(User.serializeUser()); // Provided by passport-local-mongoose

// Deserialize the user by finding them in the database using the stored ID
passport.deserializeUser(User.deserializeUser()); // Provided by passport-local-mongoose

module.exports = passport; // Export the configured Passport.js
