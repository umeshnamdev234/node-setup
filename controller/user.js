const { validateRegister, validateLogin, validationResult } = require('../validation');

const bcrypt = require('bcrypt');

const authController = require('../controller/auth');

const sendEmail = require('./sendEmail');

const { User : UserModel, sequelize }  = require('../database/models');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'estrella84@ethereal.email',
        pass: 'h6MktspDMyWX7hzuuX'
    }
});

const register = [validateRegister, async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            status : "failed",
        })
    }
    //console.log(req.body);
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const role = body.role;
    const permission = body.permission;
    const password = await bcrypt.hash(body.password,10);

    //For custom query use sequelize.query()... by defining it above.

    const allData = await UserModel.findOne({
        where: {
            email: email
        }
    });
    //console.log(allData.userProfile.dataValues);
    if(allData !== null) {
        return res.status(404).json({
            message : "User Email Already Exist!!!",
            status : "failed"
        });
    } else {

        const email_otp = createOtp(6);

        const user = await UserModel.create({
            name:name, email:email, password:password, otp:email_otp, role:role, permission:permission
        });

        //sending email 
        const to = "majidsyd@gmail.com";
        const subject = "Verify your email with otp";
        const text1 = "Hello "+name+",<br><br>"
        const text2 ="Verify your email using below link :<br>";
        const text3 = "<a style='font-size:20px;color:green' href='http://localhost:5000/verifyEmail?email="+email+"&&otp="+email_otp+"'>>>>Click Here To Verify Your Email</a>"
        const text4 = "<br><br>Thank you";
        const email_html = text1.concat(text2,text3,text4);
        sendEmail(to,subject,email_html);

        return res.status(200).json({
            message : "Register successfully",
            status : "success"
        });
    }
}]

const login = [validateLogin, async (req,res) => {
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
    
    const allData = await UserModel.findOne({
        where: {
            email: email
        }
    });

    if(allData === null) {        
        return res.status(400).json({
            message : "User Not Found",
            status : "failed",
        })
    } else {
        if(allData.is_verified === 'no' ) {
            return res.status(400).json({
                message : "Please verify your email before login!!!",
                status : "failed"
            });
        }
        const isMatch = await bcrypt.compare(password, allData.password);
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid password",
                status : "failed",
            })
        }
        const token = authController.assignToken({ id: allData.id,name : allData.name, email : allData.email});
        return res.status(200).json({
            message : "Login successfully",
            status : "success",
            token,
        })
    }

}]

const profile = async(req,res) => {
    const { email } = req.body;

    const allData = await UserModel.findOne({
        where: {
            email: email
        }
    });

    if(allData === null) {        
        return res.status(400).json({
            message : "User Not Found",
            status : "failed",
        })
    } else {
        return res.status(200).json({
            message : "data retrieved",
            status : "success",
            user : allData
        });
    }

}

const updateemail = async(req,res) => {
    const { id, email } = req.body;

    const allData = await UserModel.findOne({
        where: {
            id: id
        }
    });

    if(allData === null) {
        return res.status(404).json({
            message : "User Not Found!!!",
            status : "failed"
        });
    } else {
        const upload_status = await UserModel.update({ email: email }, {
            where: {
                id: allData.id,
            },
        });
        return res.status(200).json({
            message : "Email Verified Successfully!!!",
            status : "success",
        });  
    }

}

const deleteuser = async(req,res) => {
    const { id } = req.body;
   // console.log(name);

   const allData = await UserModel.findOne({
    where: {
        id: id
    }
    });

    if(allData === null) {
        return res.status(404).json({
            message : "User Not Found!!!",
            status : "failed"
        });
    } else {
        const upload_status = await UserModel.destroy({
            where: {
                id: id,
            },
        });
        return res.status(200).json({
            message : "Successfully Deleted",
            status : "success"
        });
    }

}

const passwordReset = (req,res) => {
    const { id, oldpassword, newpassword, confirmpassword } = req.body;

    database.query('select id,name,email,password from users where id=?',[id],async(error,results) => {

        if(error){
            return res.status(500).json({
                message : "internal server error",
                status : "failed"
            });
        }

        if(results.length > 0) {
                
            const user = results[0];
            const isMatch = await bcrypt.compare(oldpassword, user.password);
            if(!isMatch){
                return res.status(400).json({
                    message : "Old password does not match",
                    status : "failed",
                })
            }
                    
            if(newpassword !== confirmpassword) {
                return res.status(401).json({
                    message : "New Password and Confirm Password does not match",
                    status : "failed",
                })
            } else {
                const password = await bcrypt.hash(newpassword,10);
                database.query('update users set `password` = ? where id = ?',[password,id],(error,results)=> {
                    if(error) {
                        return res.status(500).json({
                            message : "Internal Server Error",
                            status : "failed"
                        });
                    }
                    return res.status(200).json({
                        message : "Password Reset Successfully",
                        status : "success",
                    });
                });
            }

        } else {
            return res.status(400).json({
                message : "User Not Found",
                status : "failed",
            })
        }

    })


}

const verifyEmail = async(req,res) => {
   // console.log(req.query);

    const email  = req.query.email;
    const otp  = req.query.otp;

    const allData = await UserModel.findOne({
        where: {
            email: email
        }
    });
    //console.log(allData);
    if(allData === null) {
        return res.status(404).json({
            message : "User Not Found!!!",
            status : "failed"
        });
    } else {
            if(otp !== allData.otp) {
                return res.status(401).json({
                    message : "Incorrect OTP!!!",
                    status : "failed",
                })
            } else {
                const upload_status = await UserModel.update({ is_verified: "yes" }, {
                    where: {
                        id: allData.id,
                    },
                });
                return res.status(200).json({
                    message : "Email Verified Successfully!!!",
                    status : "success",
                });  
            }
    }
    
}

const uploadFiles = (req,res) => {
    const file = req.files.photo;
    //console.log(req.user.id);
    file.mv("./uploads/"+file.name,function(error,results){
        if(error) {
            return res.status(500).json({
                message : "Internal Server Error",
                status : "failed"
            });
        }

        const upload_status = UserModel.update({ profile_image: file.name }, {
            where: {
                id: req.user.id,
            },
        });
        return res.status(200).json({
            message : "File Uploaded Successfully",
            status : "success",
        });
        
    });
    // console.log(req.body);
    // return res.status(200).json({
    //     message : "Reuqested File Upload!!!",
    //     status : "success"
    // });
}

// const sendEmail = (req,res) => {
//     var transporter = nodemailer.createTransport({
//         host: 'mail.openjavascript.info',
//         port : 465,
//         secure : true,
//         auth: {
//           user: '',
//           pass: ''
//         }
//     });
      
//     var mailOptions = {
//         from: '',
//         to: '',
//         subject: '',
//         text: ``
//     };
      
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//     });
// }

function createOtp(length) {
    let result = '';
    //const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

module.exports = {login,register,profile,updateemail,deleteuser,passwordReset,uploadFiles,verifyEmail}