const mongoose = require('mongoose');


let surveySchema = mongoose.Schema({
    name: String,
    email: String,
    yearOfStudy: String,
    program: String,
    applicationsLearned: [String], 
    recommendation: Number,
    additionalComments: String,
}, {
    collection: "surveys",
    timestamps: true // This enables `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Survey', surveySchema);
