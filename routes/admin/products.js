const express = require('express');
const { validationResult } = require('express-validator');
//multer is middleware used to handle multi-part form data
//we need this to allow the user to upload an image
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// memory storage stores the files in memory as Buffer objects
//this wouldn't work with large files or many files at once
const upload = multer({ storage: multer.memoryStorage() });

//Route handlers

//1
//get product listsing
router.get('/admin/products', (req, res) => {

});

//2
//get new product form
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({  }));
});

//3
//post new product form
router.post(
    '/admin/products/new', 
    //the upload accepts a single file called image
    //this must come before the validation step
    //because there is not req.bod until this has happened
    upload.single('image'),
    [requireTitle, requirePrice], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(productsNewTemplate({ errors }));
        }

        //multer stored the image in req.file.buffer
        //we store it in products.json as a base64 string
        const image = req.file.buffer.toString('base64');

        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.send('submitted');
    });

//4
//get product edit/delete form

//5
//post product edit form

//6
//post product deletion

module.exports = router;

