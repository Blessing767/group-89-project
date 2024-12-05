var express = require('express');
var router = express.Router();
const passport = require('passport')
let DB = require('../config/db')
let userModel = require('../model/users')
let User = userModel.User;
let Survey = require('../model/survey'); // Ensure the path to the model is correct

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName:req.user ? req.user.username:'' });
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName:req.user ? req.user.username:'' });
});
/* GET surveys page. */
router.get('/surveys', async function(req, res, next) {
  try {
      const surveys = await Survey.find();
      res.render('surveyList', { title: 'Surveys', surveys }); // Render survey list
  } catch (err) {
      console.error(err);
      res.render('surveyList', { title: 'Surveys', surveys: [], error: 'Failed to fetch surveys' });
  }
});

// Delete survey route
router.post('/surveys/delete/:id', async (req, res) => {
  try {
      const surveyId = req.params.id;
      await Survey.findByIdAndDelete(surveyId);
      req.flash('success', 'Survey deleted successfully!');
      res.redirect('/surveys');
  } catch (err) {
      req.flash('error', 'Error deleting survey!');
      res.redirect('/surveys');
  }
});

/* GET Contact Us page */
router.get('/contactus', function (req, res, next) {
  res.render('contactus', {
    title: 'Contact Us',
    successMessage: null, // Initialize successMessage for form submission feedback
    displayName: req.user ? req.user.username : '',
  });
});

/* POST Contact Us form */
router.post('/contactus', (req, res) => {
  const { name, email, message } = req.body; // Destructure the form data

  // Log the submitted contact form for testing purposes
  console.log(`New Contact Message Received:
  Name: ${name}
  Email: ${email}
  Message: ${message}`);

  // Send feedback to the user
  res.render('contactus', {
    title: 'Contact Us',
    successMessage: 'Thank you for reaching out! We will get back to you soon.',
    displayName: req.user ? req.user.username : '',
  });
});

// get and post router of login.ejs
router.get('/login',function(req,res,next){
  if(!req.user)
  {
    res.render('Auth/login',{
      title:'Login',
      message:req.flash('loginMessage'),
      displayName:req.user ? req.user.username:''
    })
  }
  else{
    return res.redirect('/');
  }
})
router.post('/login',function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','AuthenticationError');
      return res.redirect('/login')
    }
    req.login(user,(err)=>{
      if(err)
      {
        return next(err)
      }
      return res.redirect('/');
    })
  })(req,res,next)
})

// get and post router of register.ejs
router.get('/register',function(req,res,next){
  if(!req.user)
  {
    res.render('Auth/register',
      {
        title:'Register',
        message:req.flash('registerMessage'),
        displayName: req.user ? req.user.username:''
      }
    )
  }
  else
  {
    return res.redirect('/')
  }
})
router.post('/register',function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    //password:req.body.password,
    email:req.body.email
  })
  User.register(newUser, req.body.password,(err)=>{
    if(err){
      console.log("Error:Inserting the new user");
      if(err.name=="UserExistsError")
      {
          req.flash('registerMessage',
            'Registration Error: User already exists');
      }
      return res.render('Auth/register',
        {
          title:'Register',
          message:req.flash('registerMessage'),
          displayName: req.user ? req.user.username:''
        })
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect('/')
      })
    }
  })
})
router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err)
    {
      return next(err)
    }
  })
  res.redirect('/')
})
module.exports = router;


