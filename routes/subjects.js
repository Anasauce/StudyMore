var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/new', function(req, res, next) {
  res.render('create_subject', { title: 'Create Subject' });
});

module.exports = router;
