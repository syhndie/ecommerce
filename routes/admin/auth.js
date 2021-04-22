const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');

const router = express.Router();

//route handler for get requests
//req stands for request
//res stands for response
//first parameter defines the path for the http request
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

//in the course SG uses bodyparser
//this is deprecated and bodyparser is now included directly in express
router.post(
    '/signup', 
    [ 
        requireEmail,     
        requirePassword,
        requirePasswordConfirmation
    ], 
    handleErrors(signupTemplate),
    async (req, res) => {
        const { email, password } = req.body;

        //create returns user all user information from the repo
        const user = await usersRepo.create({ email, password });

        //define userId property in the user's cookie
        req.session.userId = user.id;
        res.redirect('/admin/products');
    }
);

router.get('/signout', (req, res) => {
    //remove cookie session by setting to null
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({ req }));
});

router.post(
    '/signin',
    [
        requireEmailExists,
        requireValidPasswordForUser
    ],
    handleErrors(signinTemplate),
    async (req, res) => {    
        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;

        res.redirect('/admin/products');
    }
);

module.exports = router;