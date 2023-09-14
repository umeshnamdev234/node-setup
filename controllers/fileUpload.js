const multer = require('multer');

const uploadFile = function(field_name,sel_path){
    return async(req,res,next)=>{
    const uploadProfile = multer({
        storage : multer.diskStorage({
            destination : function(req,file,cb){
                req.filename = sel_path
                cb(null,sel_path);
                
            },
            filename:function(req,file,cb){
                const ext = file.mimetype.split("/")[1];
                cb(null,file.fieldname+"-"+Date.now()+"."+ext);
            }
            
        })
        
        
    
    }).single(field_name);
    next();
}
}

module.exports = uploadFile;