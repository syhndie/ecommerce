//Set up web server
//express is a library to assist in setting up a full-featured server
const express = require('express');
const cookieSession =require('cookie-session');
const usersRepo = require('./repositories/users');
const { comparePasswords } = require('./repositories/users');


//app is an object that describes all the things our web server can do
const app = express();
//this tells express to apply bodyparser middleware to all route handlers
app.use(express.urlencoded({ extended: true }));
//assign encryption key to cookieSession
//changing this will invalidate all cookies created before the change
app.use(cookieSession({
    keys: ['wee97rso4xc3mxp'],
    sameSite: 'strict'
}))

//route handler for get requests
//req stands for request
//res stands for response
//first parameter defines the path for the http request
app.get('/signup', (req, res) => {
    res.send(`
        <div>
        Your id is: ${req.session.userId}
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
app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    //create returns user all user information from the repo
    const user = await usersRepo.create({ email, password });

    //define userId property in the user's cookie
    req.session.userId = user.id;
    res.send('account created');
});

app.get('/signout', (req, res) => {
    //remove cookie session by setting to null
    req.session = null;
    res.send('You are logged out');
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
    `);
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const isValidPassword = await comparePasswords(
        user.password, 
        password
    );
    if (!isValidPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;

    res.send(`${user.email} is signed in.`);
});

//add port listener
app.listen(3000, () => {
    console.log('listening');
});