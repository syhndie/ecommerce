const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { comparePasswords } = usersRepo;

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
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must be a valid email')
            .custom(async (email) => {
                const existingUser = await usersRepo.getOneBy({ email });
                if (existingUser) {
                    throw new Error('Email in use');
        }
            }),
        check('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Must be betwwen 4 and 20 characters'),
        check('passwordConfirmation')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Must be betwwen 4 and 20 characters')
            .custom((passwordConfirmation, { req }) => {
                if (passwordConfirmation != req.body.password) {
                    throw new Error('Passwords must match');
                }
            })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);

        const { email, password, passwordConfirmation } = req.body;

        //create returns user all user information from the repo
        const user = await usersRepo.create({ email, password });

        //define userId property in the user's cookie
        req.session.userId = user.id;
        res.send('account created');
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

router.post('/signin', async (req, res) => {
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

module.exports = router;