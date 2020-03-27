var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log('banner')
    res.end()
});

module.exports = router;

///