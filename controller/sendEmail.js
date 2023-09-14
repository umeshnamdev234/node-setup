const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'estrella84@ethereal.email',
        pass: 'h6MktspDMyWX7hzuuX'
    }
});


const sendEmail = async (to,subject,html) => {
    //console.log('Hello1 ');
   //return async(req,res) => {
        try{
            console.log('Hello2 ');
            const info = await transporter.sendMail({
                from: '"Yusuf Sayyed" <yusufsyd148@gmail.com>', // sender address
                to: "majidsyd@gmail.com", // list of receivers
                subject: "Verify your email with otp", // Subject line
            // text: "Hello world?", // plain text body
                html: html, // html body
            });
            //console.log('Hello3 '+info);
        }
        catch(error){
           console.log(error);
          // console.log('Hello4 '+info);
        }
        
    }
//}


module.exports = sendEmail;