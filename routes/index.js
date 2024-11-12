const express = require('express');
const router = express.Router();
const Survey = require('../model/survey');

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET about us page. */
router.get('/aboutus', function(req, res, next) {
  res.render('index', { title: 'About Us' });
});
/* GET Product page. */
router.get('/product', function(req, res, next) {
  res.render('index', { title: 'Product' });
});
/* GET Services page. */
router.get('/service', function(req, res, next) {
  res.render('index', { title: 'Service' });
});
/* GET contact me page. */
router.get('/contactus', function(req, res, next) {
  res.render('index', { title: 'Contact us' });
});

// GET landing page with active and public surveys
router.get('/', async (req, res) => {
  try {
      // Fetch only surveys that are marked as active and public
      const surveys = await Survey.find({ isActive: true, isPublic: true });
      res.render('index', { title: 'Home', surveys });
  } catch (err) {
      console.error(err);
      res.render('index', { title: 'Home', surveys: [], error: 'Failed to load surveys' });
  }
});

module.exports = router;
