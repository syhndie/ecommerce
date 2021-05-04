const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(templateFunc, dataCb) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                //if a callback function is provided, call that function
                //with the req object as a parameter
                //assign the functions return value to the data object
                //pass the data object, along with the errors, to the template 
                //this allows us to pass a product the product edit view 
                //when the product edit form is submitted with errors
                let data = {};
                if (dataCb) {
                    data = await dataCb(req);
                }
                return res.send(templateFunc({ errors, ...data }));
            }

            next();
        };
    },
    requireAuth(req, res, next) {
        if(!req.session.userId) {
            return res.redirect('/signin');
        }

        next();
    }
};