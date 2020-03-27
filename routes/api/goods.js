var express = require('express')
var router = express.Router()
let mgdb =require('../../utils/mgdb')
// 列表
router.get('/:goodsname', function(req, res, next) {

    // req.query._page

    // 判断是否有_id参数分出业务
    if(req.query._id){
        res.redirect(`/api/goods/${req.params.goodsname}/${req.query._id}`)
        return
    }
    console.log('列表','/:goodsname',req.params)

    let  collectionName=req.params.goodsname  //要操作的集合
    let {_page,_limit,_sort,p}=req.query  //获取默认参数或者手动传递的参数
    

    mgdb.findList({
        collectionName,_page,_limit,_sort,p
    }).then(
        result=>res.send(result)

    ).catch(
        err=>res.send(err)
    )

    // res.end()
});
// 详情
router.get('/:goodsname/:_id', function(req, res, next) {
    console.log('详情','/:goodsname/:_id',req.params)
    let  collectionName=req.params.goodsname  //要操作的集合
    let  _id=req.params._id  //要操作的_id

    mgdb.findDetail({
        collectionName,_id
    }).then(
        result=>res.send(result)

    ).catch(
        err=>res.send(err)
    )

});


module.exports = router;

// 数据库{
//     库名：ruirui  集合名：home banner user 
// }
// "_id" : 123, 
// home={ 
//     "title" : "阿朱", 
//     "des" : "阿朱阿朱阿朱阿朱阿朱", 
//     "time":1583303411,
//     "detail" : { 
//       "auth" : "4", 
//       "content" :"<p>天龙八部天龙八部天龙八部天龙八部</p>", 
//       "auth_icon" : "/upload/user/59a50b6c32d51f0836388e4d634ee523.jpg" 
//     } 
//   }
// banner：	[
    // aaa={"title" : "段誉","sub_title" : "钟灵","banner" : "天龙八部","time":1583821411,"detail" : {"auth" : "金庸","content" : "<p>凌波微步<p>","icon" : "/upload/banner/59a50b6c32d51f0836388e4d634ee523.jpg" }}
//   ]

// user:	
//  aaa= { "username" : "alex", 
//     "password" : "alex123", 
//     "follow" : "100", 
//     "fans" : "200", 
//     "nikename" : "爱丽丝", 
//     "icon" : "/upload/user/59a50b6c32d51f0836388e4d634ee523.jpg", 
//     "time" : 1551620448550 
//   }

//   aaa={ "title" : "星宿派", 
//         "des" : "北冥神功北冥神功北冥神功北冥神功北冥神功", 
//         "time":1583303411,
//         "detail" : { 
//           "auth" : "4", 
//           "content" :"<p>天龙八部天龙八部天龙八部天龙八部</p>", 
//           "auth_icon" : "/upload/user/59a50b6c32d51f0836388e4d634ee523.jpg" 
//         } 
//       }