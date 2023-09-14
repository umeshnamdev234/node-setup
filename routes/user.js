const express = require('express');
const router = express.Router();
const { register, login, profile, updateemail, deleteuser, passwordReset, uploadFiles, verifyEmail } = require('../controller/user');
const { verifyToken }  = require('../controller/auth')
router.post('/register', register);
router.post('/login', login);
router.post('/profile',verifyToken,isAuthorized('admin','editor'), profile);
router.post('/updateemail',verifyToken, updateemail);
router.delete('/deleteuser',verifyToken,isAuthorized('admin'), deleteuser);
router.post('/passwordreset',verifyToken, passwordReset);
router.post('/fileupload',verifyToken, uploadFiles);
router.get('/verifyEmail', verifyEmail);

module.exports = router;