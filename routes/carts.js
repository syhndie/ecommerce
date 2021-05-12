const express = require('express');
const cartsRepo = require('../repositories/carts');

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

//3
//post delete item from cart

module.exports = router;