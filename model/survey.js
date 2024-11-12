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
}, {
    collection: "surveys"
});

module.exports = mongoose.model('Survey', surveySchema);