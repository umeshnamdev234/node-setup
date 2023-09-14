const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const verifyToken = (req,res,next) => {
    const authToken = req.headers['authorization'];

    if(!authToken){
        return res.status(401).json({
            message : "access denied",
        });
    }
    const token = authToken.split(' ')[1];
    try {
        const user = jwt.verify(token,SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            message : "invalid token",
        });
    }
}

const assignToken = (user) => {
    return jwt.sign(user,SECRET_KEY,{ expiresIn:'1h'}); 
}

module.exports = {
    verifyToken, assignToken
}