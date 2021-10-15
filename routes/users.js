const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

//login page
router.get('/login', (req, res, next) => {
   res.render('login');
});


//Register page
router.get('/register', (req, res, next) => {

   res.render('register');
});


//Register handle
router.post('/register', (req, res, next) => {
   const { name, email, password, password2 } = req.body;

   let errors = [];
   // console.log(name, email, password, password2);

   //Check required fields 
   if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please fill all fields' });
   }

   //Check password match
   if (password !== password2) {
      errors.push({ msg: 'Passwords don\'t match' });
   }

   //Check password length
   if (password.length < 6) {
      errors.push({ msg: 'Password length must be atleast 6 characters' });
   }

   // console.log(errors);

   if (errors.length > 0) {
      //Go back to register page with errors and previous inputs
      res.render('register', {
         errors,
         name,
         email,
         password,
         password2
      });
   }
   else {
      //Validation passed
      User.findOne({ email: email })
         .then(user => {
            if (user) {
               errors.push({ msg: 'Email is already registered' });
               res.render('register', {
                  errors,
                  name,
                  email,
                  password,
                  password2
               });
            }
            else {
               //Hash password
               bcrypt.genSalt(10, (err, salt) =>
                  bcrypt.hash(password, salt, (err, hash) => {
                     if (err) throw err;

                     const newUser = new User({
                        name, // same as name: name
                        email, // email: email
                        password: hash
                     });

                     newUser.save()
                        .then(user => {
                           req.flash('success_msg', 'Registration Successful, you can now log in');
                           res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                  }));
            }
         })
         .catch()
   }
});


//Login handle
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
});

//Logout Handle  

router.get('/logout', (req, res, next) => {
   req.logOut();
   req.flash('success_msg', 'You are logged out');
   res.redirect('/users/login');
});


module.exports = router;