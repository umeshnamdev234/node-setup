const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.SECRET_KEY;
const { User : UserModel }  = require('../database/models');
//console.log(secret_key);
//const { SECRET_KEY } = require('../config');
const verifyToken = (req,res,next)=>{
    const headerBearer = req.headers['authorization'];
    if(typeof headerBearer !== 'undefined'){
        const fullToken = headerBearer.split(' ');
        const token = fullToken[1];
        try{
            const user = jwt.verify(token,secret_key);
            req.user = user;

        }catch(error){
            return res.status(401).json({
                message : 'Invalid Token',
                status : 'failed'
            })

        }
        req.token = token;

        next();
    }else{
        return res.status(401).json({
            message : 'Invalid Token',
            status : 'failed'
        })

    }
}

const assignToken = (user)=>{
    return jwt.sign(user,secret_key,{expiresIn:'1h'});
}


function checkPermission(...permittedRoles){
    return async(req,res,next)=>{
        uid = req.user.id;
        const loggedInUser = await UserModel.findByPk(uid)
        if(loggedInUser && permittedRoles.includes(loggedInUser.role)){
            next()
        }else{
            return res.status(403).json({
                message : "Forbidden",
                status : "failed"
            })
        }
    }
}

module.exports = {verifyToken,assignToken,checkPermission};