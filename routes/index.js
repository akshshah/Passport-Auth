const express = require('express');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const router = express.Router();

//Welcome page
router.get('/', forwardAuthenticated, (req, res, next) => {

   res.render('welcome');
});

//Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
   res.render('dashboard', {
      user: req.user
   });
});


module.exports = router;