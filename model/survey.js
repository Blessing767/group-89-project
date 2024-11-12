// models/survey.js
let mongoose = require('mongoose');

// Define the schema
let surveySchema = mongoose.Schema({
    name: String,
    email: String,
    yearOfStudy: String,
    program: String,
    applicationsLearned: [String],
    recommendation: Number,
    additionalComments: String,
    isActive: { type: Boolean, default: true },  // New field to mark surveys as active
    isPublic: { type: Boolean, default: true }   // New field to mark surveys as public
}, {
    collection: "surveys"
});

module.exports = mongoose.model('Survey', surveySchema);