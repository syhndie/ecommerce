const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

//1
//post add to cart submission
router.post('/cart/products', async (req, res) => {
    //make a cart or retrieve existing cart
    let cart;
    if (!req.session.cartId) {
        //we don't have a cart, so create one 
        //and store cart id as req.session.cartId
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;

    } else {
        //we do have a cart, so retrieve it from repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    //increment existing product or add new product 
    const existingItem = cart.items.find(
        item => item.id === req.body.productId);

    if (existingItem) {
        //increment quantity and save cart
        existingItem.quantity++;
    } else {
        //add new product id to itmes array
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, { items: cart.items });
    res.send('product in cart');
});

//2
//get shopping cart
router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        //an item is an abject with an id and quantity
        //use the item id to pull the actual product from the repo
        const product = await productsRepo.getOne(item.id);

        //add the product to the item object
        //this change won't be saved to the repo         
        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items }));
});

//3
//post delete item from cart
router.post('/cart/products/delete', async (req, res) => {
    const cart = await cartsRepo.getOne(req.session.cartId);
    const { itemId } = req.body;
    
    //filter cart items - keep only those that do not have itemId
    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, { items });

    res.redirect('/cart');
});

module.exports = router;