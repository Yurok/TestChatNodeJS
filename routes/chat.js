var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/checkAuth');

/* GET chat page. */
router.get('/', checkAuth, function(req, res, next) {
    res.render('chat');
});

module.exports = router;
