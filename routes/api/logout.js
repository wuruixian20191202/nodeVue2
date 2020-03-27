var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    // token 退出 无需后端操作，需要前端删除coolie/localStorge里面的token

    console.log('logout')
    RegExp.send({err:0,msg:'退出'})
});

module.exports = router;