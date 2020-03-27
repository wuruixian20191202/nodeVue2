let jwt = require('../../utils/jwt')

module.exports = (req, res, next) => {
    // 公共参数
    req.query._page = req.query._page ? req.query._page - 0 : require('../../config/global')._page - 0
    req.query._limit = req.query._limit ? req.query._limit - 0 : require('../../config/global')._limit - 0
    req.query.p = req.query.p ? req.query.p : require('../../config/global').p
    req.query._sort = req.query._sort ? req.query._sort : require('../../config/global')._sort

    req.body._page = req.body._page ? req.body._page - 0 : require('../../config/global')._page - 0
    req.body._limit = req.body._limit ? req.body._limit - 0 : require('../../config/global')._limit - 0
    req.body.p = req.body.p ? req.body.p : require('../../config/global').p
    req.body._sort = req.body._sort ? req.body._sort : require('../../config/global')._sort

    req.headers._page = req.headers._page ? req.headers._page - 0 : require('../../config/global')._page - 0
    req.headers._limit = req.headers._limit ? req.headers._limit - 0 : require('../../config/global')._limit - 0
    req.headers.p = req.headers.p ? req.headers.p : require('../../config/global').p
    req.headers._sort = req.headers._sort ? req.headers._sort : require('../../config/global')._sort

    // 公共的业务
    if (/login|reg|logout/.test(req.url)) { //登录。注册注销 无序token
        next()
    } else { //自动登录，商品列表。详情需要token
        // 获取token
        let token = req.headers.token || req.body.token || req.query.token
            // 校验token
        jwt.verify(token).then(
            decode => {
                req.query.decode = decode;
                next()
            }
        ).catch(
            message => res.send({
                err: 2,
                msg: 'token过期或者未登录'
            })
        )
    }
}