const express = require('express');

const app = express();

const fileupload = require('express-fileupload');

const userRoutes = require('./routes/user');

app.use('/uploads', express.static('uploads'));

app.use(express.json()); 

app.use(fileupload());

app.use(userRoutes); 

app.listen(5000,() => {
    console.log('Server is running on port 5000');
})