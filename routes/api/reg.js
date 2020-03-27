var express = require('express');
var router = express.Router();
let fs=require('fs')
let path=require('path')//引入path模块避免与属性冲突
let mgdb=require('../../utils/mgdb')
let bcrypt=require('../../utils/bcrypt')

router.post('/', function(req, res, next) {
// 获取username password  nikename icon // 必传参数校验 username password// 整理其他未来需要入库的参数，time nikename 头像到对应的磁盘
    let {username,password,nikename}=req.body
    if(!username||!password){
        res.send({
            err:1,
            msg:'用户名和密码为必传参数'
        })
        return 
    }else{
    nikename=req.body.nikename||'alex'
    let follow=0
    let fans=0
    let time=Date.now()
    let icon='/upload/default.jpg'; //默认头像
    if(req.files && req.files.length>0){// 图片改名  第一path是req属性  第二path是pathmk模块
        fs.renameSync(
            req.files[0].path,
            req.files[0].path + path.parse(req.files[0].originalname).ext
        )
        icon='/upload/user/'+req.files[0].filename+path.parse(req.files[0].originalname).ext
    }
    
    console.log(123)
    // 兜库 兜库 用户是否存在的校验  库连接 查库 用户存在删头像（不能查默认头像） 用户不存在 入库
    mgdb.open({ dbName:'ruirui',collectionName:'user'})
    .then(({collection,client})=>{
            collection.find({username}).toArray((err,result)=>{
                if(err){
                    res.send({err:1,msg:'查询失败'})
                    client.close()
                }else{
                    if(result.length===0){ // 用户名不存在，入库
                        password=bcrypt.hashSync(password)
                        collection.insertOne({username,password,nikename,fans,follow,time,icon},(err,result)=>{
                            if(!err){ //插入后的信息返回给客户端不含username password
                                delete result.ops[0].username;
                                delete result.ops[0].password;
                                res.send({
                                    err:0,
                                    msg:'注册成功',
                                    data:result.ops[0]
                                })
                            }else{
                                res.send({err:1,msg:'注册失败'})
                            }
                            client.close()
                        })
                    }
                    else{ //用户名存在，要看是否上传头像，如果没有就是默认的，不用操作，不会增加数据库的容量，如果上传了头像，就把上传的文件删除
                        if(icon.indexOf('default')===-1){ //
                            fs.unlinkSync('./public'+icon)
                        }
                        res.send({err:1,msg:'用户名已存在'})
                        client.close()
                    }
                }

            })  
        }
    ).catch(
        err=>{
            res.send({err:1,msg:'集合操作失败'})
        }
    )
    }

   
    
});


module.exports = router;