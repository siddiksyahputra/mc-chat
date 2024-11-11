const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

const getUserDetailFromToken = async (token)=>{
    if(!token){
        return{
            message : 'Session out',
            logout : true,
        }
    }
    
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)

    const user = await userModel.findById(decode.id).select('-password')

    return user
}

module.exports = getUserDetailFromToken