const { validationResult } = require('express-validator');

const fs = require('fs');
let Middleware = {}
fs.readdirSync(__dirname).filter((file)=>{
    return file !== 'index.js';
}).forEach((file)=>{
    Middleware = {...Middleware, ...require('./'+file)}
})

module.exports = { validationResult, ...Middleware }