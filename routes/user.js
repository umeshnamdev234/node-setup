const express = require('express');
const router = express.Router();
const{register,login,profile,updateProfile,deleteUser,updatePassword,emailVerification,uploadProfileImage,createUser,allUsers} = require('../controllers/user')
const{verifyToken,checkPermission} = require('../controllers/auth');
const uploadFile = require('../controllers/fileUpload');

router.post('/register',register)
router.get('/emailVerification',emailVerification)
router.post('/profile',verifyToken,profile);
router.post('/login',login);
router.post('/updateProfile',verifyToken,updateProfile);
router.delete('/deleteUser',verifyToken,checkPermission(1),deleteUser)
router.post('/updatePassword',verifyToken,updatePassword);
router.post('/createUser',verifyToken,checkPermission('admin'),createUser);
router.get('/allUsers',allUsers);
router.post('/uploadProfileImage',uploadFile('userfile','uploads'),verifyToken,uploadProfileImage);
module.exports = router;