const { body } = require('express-validator');
const validateRegister =  [
    body('name').isLength({ min: 6 }).withMessage('Name must be at least 6 characters'),
    body('email').isEmail().withMessage('Invalid Email Address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const validateLogin = [
    body('email').isEmail().withMessage('Invalid Email Address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

module.exports = {
    validateRegister, validateLogin
}