const express = require('express');

//multer is middleware used to handle multi-part form data
//we need this to allow the user to upload an image
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit')
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// memory storage stores the files in memory as Buffer objects
//this wouldn't work with large files or many files at once
const upload = multer({ storage: multer.memoryStorage() });

//Route handlers

//1
//get product listsing
router.get('/admin/products', requireAuth, async (req, res) => {    
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

//2
//get new product form
router.get('/admin/products/new', requireAuth, (req, res) => {    
    res.send(productsNewTemplate({  }));
});

//3
//post new product form
router.post(
    '/admin/products/new', 
    requireAuth,
    //the upload accepts a single file called image
    //this must come before the validation step
    //because there is not req.bod until this has happened
    upload.single('image'),
    [requireTitle, requirePrice], 
    handleErrors(productsNewTemplate),
    async (req, res) => {        
        //multer stored the image in req.file.buffer
        //we store it in products.json as a base64 string
        if (req.file) {
            image = req.file.buffer.toString('base64');
        } else {
            image ='';
        }
    
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.redirect('/admin/products');
    });

//4
//get product edit/delete form
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
        return res.send('Product not found');
    }

    res.send(productsEditTemplate({ product }));
});

//5
//post product edit form
router.post(
    '/admin/products/:id/edit', 
    requireAuth, 
    upload.single('image'),
    [requireTitle, requirePrice],
    //give handleErrors a callback that will return the product
    //that is being edited to the handleErrors method
    handleErrors(productsEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try {
        await productsRepo.update(req.params.id, changes)
        } catch (err) {
            res.send('Could not find item');
        }

        res.redirect('/admin/products');
    }
);

//6
//post product deletion

module.exports = router;

