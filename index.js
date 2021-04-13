//Set up web server
//express is a library to assist in setting up a full-featured server
const express = require('express');
const cookieSession = require('cookie-session');
const { comparePasswords } = require('./repositories/users');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');


//app is an object that describes all the things our web server can do
const app = express();
//this tells express to make our static files in the folder public available to the server
app.use(express.static('public'));
//this tells express to apply bodyparser middleware to all route handlers
app.use(express.urlencoded({ extended: true }));
//assign encryption key to cookieSession
//changing this will invalidate all cookies created before the change
app.use(cookieSession({
    keys: ['wee97rso4xc3mxp'],
    sameSite: 'strict'
    })
);
app.use(authRouter);
app.use(productsRouter);

//add port listener
app.listen(3000, () => {
    console.log('listening');
});