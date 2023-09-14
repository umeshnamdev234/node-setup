const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mossie7@ethereal.email',
        pass: 'M8b3kJ8nEQWkv6wxnz'
    }
});

const sendEmail = async function(to,subject,content){
   // return async(req,res)=>{
       
        try{
            const info = await transporter.sendMail({
                from: '"Majid Sayyed" <majidsyd@gmail.com>',
                to: to,
                subject: subject,
               // text: "Hello world?", // plain text body
                html: content, // html body
              });
              
        }
        catch(error){
            console.log('error'+error);
        }
        
  //  }
}

module.exports = sendEmail;


