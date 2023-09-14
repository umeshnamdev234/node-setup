const { body } = require('express-validator');
const validateRegister = [
    body('firstName').notEmpty().withMessage('Name is required'),
   // body('name').isLength({ min: 6 }).withMessage('Name must be at least 6 characters'),
    body('email').isEmail().withMessage('Invalid Email Address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const validateLogin = [
    body('email').isEmail().withMessage('Invalid Email Address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateUpdateUsername = [
    body('firstName').notEmpty().withMessage('Name field cannot be empty')
]

module.exports = {
    validateRegister,validateLogin,validateUpdateUsername
}