
const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
app.use(express.json()); 
app.use(userRoutes);    
app.use('/uploads', express.static('uploads'));


app.listen(3000,()=>{
    console.log('server is running on port 3000//success');
})