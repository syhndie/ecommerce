module.exports = {
    getError(errors, prop) {
        //prop for property can be email, password, or passwordConfirmation
        try {
            //errors.is an array of error objects, each one looks like:
            //  value: 'testingd',
            //  msg: 'Passwords must match',
            //  param: 'passwordConfirmation',
            //  location: 'body'
            //errors.mapped() is a method on the validation result
            //it returns an object that contains items that looks like:
            //    passwordConfirmation: {
            //      value: 'testingd',
            //      msg: 'Passwords must match',
            //      param: 'passwordConfirmation',
            //      location: 'body'
            //    }
            //errors.mapped()[prop] pulls just errors that match the property
            //errors.mapped()[prop].msg is a string == the error message
            //if there is no error for that property, it will be undefined
            return errors.mapped()[prop].msg;
        } catch (err) {
            //if we end up in the catch, there are either no errors at all
            //or at least no error for the property we are checking
            //*probably* 
            //so, return an empty string
            return '';
        }
    }
};