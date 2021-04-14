const Repository = require('./repository');

class ProductsRepository extends Repository {

}

//create instance of the repo and export
module.exports = new ProductsRepository('products.json');