var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query._page,req.body._limit,req.body.p)
  res.end()
});

module.exports = router;
