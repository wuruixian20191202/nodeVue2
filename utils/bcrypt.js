let bcrypt=require('bcrypt')

module.exports={
    // 加密
    hashSync:(password)=>{
        return bcrypt.hashSync(password,10)
    },
    // 校验
    compareSync:(sendPassword,hash)=>{
        return bcrypt.compareSync(sendPassword,hash)
    }
}