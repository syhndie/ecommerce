const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

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
router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    res.send('submitted');
});

//4
//get product edit/delete form

//5
//post product edit form

//6
//post product deletion

module.exports = router;

