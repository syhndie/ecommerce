const express = require('express');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');

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

//4
//get product edit/delete form

//5
//post product edit form

//6
//post product deletion

module.exports = router;

