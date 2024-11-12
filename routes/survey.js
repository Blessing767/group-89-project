// POST to create a new survey
router.post('/create', async (req, res) => {
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
        res.render('surveyList', { title: 'Surveys', surveys });
    } catch (err) {
        console.error(err);
        res.render('surveyList', { title: 'Surveys', error: 'Failed to load surveys' });
    }
});

// POST to update an existing survey
router.post('/edit/:id', async (req, res) => {
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
        res.render('surveyEditForm', { title: 'Edit Survey', error: 'Failed to update survey' });
    }
});

// POST to delete a survey
router.post('/delete/:id', async (req, res) => {
    try {
        await Survey.findByIdAndRemove(req.params.id);
        res.redirect('/surveys');
    } catch (err) {
        console.error(err);
        res.render('surveyList', { title: 'Surveys', error: 'Failed to delete survey' });
    }
});

module.exports = router;