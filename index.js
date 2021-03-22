//Set up web server
//express is a library to assist in setting up a full-featured server
const express = require('express');

//app is an object that describes all the things our web server can do
const app = express();
//this tells express to apply bodyparser middleware to all route handlers
app.use(express.urlencoded({ extended: true }));

//route handler for get requests
//req stands for request
//res stands for response
//first parameter defines the path for the http request
app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

//in the course SG uses bodyparser
//this is deprecated and bodyparser is now included directly in express
app.post('/', (req, res) => {
    console.log(req.body);
    res.send('account created');
});

//add port listener
app.listen(3000, () => {
    console.log('listening');
});