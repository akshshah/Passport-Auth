const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


module.exports = function (passport) {
   passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
         //Match user
         User.findOne({ email: email })
            .then(user => {
               if (!user) {

                  // return done(null, false, { message: 'Incorrect Email' });
                  return done(null, false, { message: 'Login Failed' });
               }

               //Match password
               bcrypt.compare(password, user.password, (err, isMatch) => {
                  if (err) throw err;

                  if (isMatch) {
                     return done(null, user);
                  }
                  else {
                     //return done(null, false, { message: 'Incorrect Password' });
                     return done(null, false, { message: 'Login Failed' });
                  }
               });
            })
            .catch(err => console.log(err));
      })
   );


   passport.serializeUser((user, done) => {
      done(null, user.id);
   });
   passport.deserializeUser((id, done) => {
      User.findOne({ id }, (err, user) => {
         done(err, user);
      });
   });

}

