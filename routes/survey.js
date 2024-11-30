const express = require('express');
const router = express.Router();
const Survey = require('../model/survey'); // Import survey model

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirect to login page if not authenticated
}

// GET the survey creation form (protected)
router.get('/create', isAuthenticated, (req, res) => {
    res.render('surveyForm', {
        title: 'Create Survey',
        formAction: '/surveys/create', // Add formAction for the POST route
        survey: null, // No survey data for creating a new survey
        error: null // No error initially
    });
});

// GET edit survey form (protected)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id); // Fetch survey by ID
        if (!survey) {
            return res.redirect('/surveys'); // Redirect if survey is not found
        }
        res.render('surveyForm', {
            title: 'Edit Survey',
            survey, // Pass survey data to the form
            formAction: `/surveys/edit/${req.params.id}`, // Specify the form's action for POST
            error: null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/surveys'); // Redirect in case of an error
    }
});

// POST to create a new survey (protected)
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const newSurvey = new Survey({
            name: req.body.name,
            email: req.body.email,
            yearOfStudy: req.body.yearOfStudy,
            program: req.body.program,
            applicationsLearned: req.body.applicationsLearned, // Checkbox options
            recommendation: req.body.recommendation,           // Likert scale
            additionalComments: req.body.additionalComments
        });
        await newSurvey.save();
        res.redirect('/surveys'); // Redirect to list of surveys after saving
    } catch (err) {
        console.error(err);
        res.render('surveyForm', { title: 'Create Survey', error: 'Failed to save survey' });
    }
});

// GET all surveys for display on the landing page
router.get('/', async (req, res) => {
    try {
        const surveys = await Survey.find();
        res.render('surveyList', { title: 'Surveys', surveys, error: null });
    } catch (err) {
        console.error(err);
        res.render('surveyList', { title: 'Surveys', error: 'Failed to load surveys' });
    }
});

// POST to update an existing survey (protected)
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        await Survey.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            yearOfStudy: req.body.yearOfStudy,
            program: req.body.program,
            applicationsLearned: req.body.applicationsLearned,
            recommendation: req.body.recommendation,
            additionalComments: req.body.additionalComments
        });
        res.redirect('/surveys');
    } catch (err) {
        console.error(err);
        res.render('surveyEditForm', { title: 'Edit Survey', error: 'Failed to update survey', survey: req.body });
    }
});

// POST to delete a survey (protected)
router.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Survey.findByIdAndDelete(req.params.id);
        res.redirect('/surveys'); // Redirect to the survey list
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting survey');
    }
});

module.exports = router;
