const { validateRegister, validateLogin, validationResult } = require('../validation');
const bcrypt = require('bcrypt');
const { users : UserModel }  = require('../database');
const authController = require('../controller/auth');

const register = [ validateRegister , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            status : "failed",
        })
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await UserModel.create({
        name, email, password :hashedPassword
    });
    const token = authController.assignToken({ id: user.insertId,name, email });
    return res.status(200).json({
        message : "Register successfully",
        status : "success",
        token
    })
}];

const login = [ validateLogin, async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors : errors.array(),
                status : "failed",
            })
        }
        const body = req.body;
        const email = body.email;
        const password = body.password;
        database.query('SELECT id,name,email,password FROM users WHERE email =? limit 1',[email], async (error,results)=>{
            if(error){
                return res.status(500).json({
                    message : "Internal Server Error",
                    status : "failed",
                })
            }
            if(results.length > 0){
                const user = results[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch){
                    return res.status(400).json({
                        message : "Invalid password",
                        status : "failed",
                    })
                }
                const token = authController.assignToken({ id: user.id,name : user.name, email : user.email});
                return res.status(200).json({
                    message : "Login successfully",
                    status : "success",
                    token,
                })
            }
            return res.status(400).json({
                message : "User Not Found",
                status : "failed",
            })
        });
}]

const profile = (req, res) => {
    const id = req.user.id;
    database.query('SELECT id,name,email,password FROM users WHERE id =? limit 1',[id], async (error,results)=>{
        if(error){
            return res.status(500).json({
                message : "Internal Server Error",
                status : "failed",
            })
        }
        if(results.length > 0){
            const user = results[0];
            return res.status(200).json({
                message : "Login successfully",
                status : "success",
                user,
            })
        }
        return res.status(400).json({
            message : "User Not Found",
            status : "failed",
        })
    });
}
module.exports = {
    register,login,profile
}