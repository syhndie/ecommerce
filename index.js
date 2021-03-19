//Set up web server
//express is a library to assist in setting up a full-featured server
const express = require('express');

//app is an object that describes all the things our web server can do
const app = express();

//route handler for get requests
//req stands for request
//res stands for response
//first parameter defines the kind of request - / means root route
app.get('/', (req, res) => {
    res.send('hi there');
});

//add port listener
app.listen(3000, () => {
    console.log('listening');
});