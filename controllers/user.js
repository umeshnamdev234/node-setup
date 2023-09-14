const {validateRegister,validationResult,validateLogin,validateUpdateUsername} = require('../validations');
const bcrypt = require('bcrypt');
const { User : UserModel }  = require('../database/models');
const authController = require('../controllers/auth');
const sendEmail = require('../controllers/emailSender');

const register = [validateRegister,async (req,res)=>{ 

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            status : "failed",
        })
    }
    
    const name = req.body.name;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password,10);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role;

    const user = await UserModel.findOne({ where: { email: email} });

    if(user === null){
        //generate otp
        const email_otp = createOtp(6);
        //sending email 

        const text1 = "Hello"+name+",<br>"
        const text2 ="Verify your email using below link :<br>";
        const text3 = "<a style='font-size:20px;color:red' href='http://localhost:3000/emailVerification?email="+email+"&&otp="+email_otp+"'>Verify Email</a>"
        const text4 = "<br>Thank you";
        const email_html = text1.concat(text2,text3,text4);
        const to = email;
        const subject = 'Verify your email!';
        sendEmail(to,subject,email_html);
        const created_user = await UserModel.create({
            firstName,lastName, email, password,email_otp,role
        });

        return res.status(200).json({
            message : "Registered Successfully",
            status  : "success",
            
        })

    }else{
        return res.status(500).json({
            message : "Email already registered",
            status : "failed"
        })
    }

   
   
}]

const emailVerification =  async(req,res) => {
    const {email,otp} = req.body;
    const user = await UserModel.findOne({ where: { email: email, email_otp:otp} });
    if (user === null) {
        return res.status(400).json({
            message : 'User not found',
            status : 'failed'
        })
    } else {
        await UserModel.update({ is_otp_verified: "yes" }, {
            where: {
              email: email,
            },
          });
        const token = authController.assignToken({id:user.id,email:user.email,name:user.name});
        return res.status(200).json({
            message : 'Otp Verified Successfully',
            status : 'success',
            token
        })
        
    }
}


const profile = async(req,res)=>{
    const uid = req.user.id;
    const user_details = await UserModel.findOne(
        { where: { id: uid},
        attributes: { exclude: ['password'] },
     }
        
        );
    if (user_details === null) {
        return res.status(400).json({
            message : 'User not found',
            status : 'failed'
        })
    } else {
        const image_path = 'https://localhost/'+user_details.profile_image;
        user_details.profile_image = image_path;
        
        return res.status(200).json({
            message : 'Profile accessed successfully',
            status : 'success',
            user_details
        })
        
    }

}


const uploadProfileImage = async(req,res)=>{
    console.log(req.file);
    const file_path = req.file.path;
    const uid = req.user.id;

    await UserModel.update({ profile_image: file_path }, {
        where: {
          id: uid
        }
      });

    return res.status(200).json({
        message : "Profile image uploaded successfully",
        status  : "success",
        
    })
    
}

const login = [validateLogin, async(req,res)=>{
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            status : "failed",
        })
    }

    const user = await UserModel.findOne({ where: { email: email} });
    if (user === null) {
        return res.status(400).json({
            message : 'User not found',
            status : 'failed'
        })
    } else {

        const isMatch = await bcrypt.compare(password, user.password);

            if(user.is_otp_verified==='no'){
                return res.status(400).json({
                    message : "Email is not verified",
                    status : "failed",
                })
            }

            if(!isMatch){
                return res.status(400).json({
                    message : "Invalid password",
                    status : "failed",
                })
            }
            
            const token = authController.assignToken({id:user.id,email:user.email,name:user.name});
            return res.status(200).json({
                message : 'Login Successfully',
                status : 'success',
                token
            })
        
        
    }

    

}]

const updateProfile = [validateUpdateUsername,async(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            status : "failed",
        })
    }
    const uid = req.user.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    
    await UserModel.update(
        { firstName,lastName }, 
        {where: {id: uid}}
      );

    return res.status(200).json({
        message : 'User details updated',
        status : 'success'
    })

    
}]

const deleteUser = async(req,res)=>{
    const{ id } = req.body;
    const userToDelete = UserModel.findByPk(id)
    if(userToDelete === null){
        return res.status(400).json({
            message : 'User does not exist',
            status : 'failed'
        })
    }else{
        
        await UserModel.destroy({
            where : {
                id
            }
        })
    }

    return res.status(200).json({
        message : 'User deleted successfully',
        status : 'success'
    })


    
}

const updatePassword =  async(req,res) =>{
    const{id,oldPassword,newPassword,matchPassword} = req.body;
    const user_present = UserModel.findByPk(id);
    if(user_present === null){
        return res.status(400).json({
            message : 'user not exist',
            status : 'failed'
        })
    }else{

        const oldPasswordMatch = await bcrypt.compare(oldPassword, currentPassword);
        
            if(oldPasswordMatch && newPassword == matchPassword){
                const hashedPassword  = await bcrypt.hash(newPassword,10);
                const user = UserModel.update({password : hashedPassword},
                    {where : {id}}
                );
                return res.status(200).json({
                    message : 'password updated',
                    status : 'success'
                })

            }else if(!oldPasswordMatch){
                return res.status(400).json({
                    message : 'Old password does not Match',
                    status : 'failed'
                })
            }else if(newPassword != matchPassword){
                return res.status(400).json({
                    message : 'Repeat Password does not match',
                    status : 'failed'
                })
            }

    }
    
}

const createUser = async(req,res) =>{
    
    const {firstName,lastName,email,password,role} = req.body;

    const is_user_exist = await UserModel.findOne({ where: { email: email} });

    if(is_user_exist ===null){
        const created_user = await UserModel.create({
            firstName,lastName, email, password,role
        });
    
        return res.status(200).json({
            message : "User Created Successfully",
            status  : "success",
            
        })
    }else{
        return res.status(200).json({
            message : "Email already exist",
            status  : "failed",
            
        })
    }
    

}

const allUsers = async(req,res)=>{
    // Find all users
    
    const users = await UserModel.findAll({
        attributes: ['firstName', 'lastName','email','profile_image','role']
    });
   // console.log(users.every(user => user instanceof UserModel)); // true
    //console.log("All users:", JSON.stringify(users, null, 2));
    let table = '<table style="border:1px solide"><th><td>First Name</td><td>Last Name</td><td>Email</td><td>Profile Image</td><td>Role</td></th>';
    for (let i = 0; i < users.length; i++)  {
        single = users[i].dataValues;
        table+='<tr><td>'+single.firstName+'</td><td>'+single.lastName+'</td><td>'+single.email+'</td><td>'+single.profileImage+'</td><td>'+single.role+'</td><tr>';
        

      }
      table +='</table>';

    //const all_users = JSON.stringify(users, null, 2);
    
   // console.log(JSON.stringify(users, null, 2));
    return res.status(200).json({
        message : "All users retrieved",
        status  : "success",  
        table
    })
}



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


module.exports = {register,profile,login,deleteUser,updateProfile,emailVerification,uploadProfileImage,updatePassword,createUser,allUsers}