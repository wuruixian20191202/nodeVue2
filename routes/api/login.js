var express = require('express');
var router = express.Router();
let mgdb=require('../../utils/mgdb')
let bcrypt=require('../../utils/bcrypt')
let jwt=require('../../utils/jwt')

router.post('/', function(req, res, next) {
// 获取username password
let  {username,password}=req.body
if(!username||!password){
    res.send({
        err:1,
        msg:'用户名密码为必传参数'
    })
    return
}

// 设定必传参数

// 兜库查询
mgdb.open({
    dbName:'ruirui',
    collectionName:'user'
}).then(
    ({collection,client})=>{
        collection.find({
            username
        }).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'集合操作失败'})
                client.close()
            }else{
                // 用户存在不存在
                if(result.length>0){
                    let bl=bcrypt.compareSync(password,result[0].password)
                    if(bl){
                        let token=jwt.sign({username,_id:result[0]._id})
                        delete result[0].username;
                        delete result[0].password;
                        res.send({err:0,msg:'登录成功',data:result[0],token})
                    }else{
                        res.send({err:1,msg:'用户名或者密码有误'})
                    }
                    client.close()
                }else{
                    res.send({err:1,msg:'用户名或者密码有误'})
                    client.close()
                }
            }
        })
    }
).catch(
    err=>{
        res.send({err:1,msg:'集合操作失败'})
        client.close()
    }
)





    // console.log('login')
    // res.end()
});

module.exports = router;