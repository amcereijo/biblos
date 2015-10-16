var fs = require('fs');

function addProductsFromFile() {
	var products = fs.readFileSync('products.json', 'utf8');
 	var productsObject;
 	var product, i;
 	if(products) {
 		productsObject = JSON.parse(products);
	 	for(i=0;i<productsObject.length;i++) {
	 		product = productsObject[i];
	 		console.log('Inserting product: ', product);
			Product.create(product).exec(function createCB(err, createdProduct){
				console.log('Created product: %s' + JSON.stringify(createdProduct));
			});
	 	}
 	}
}

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  	console.log('this runs at startup!');

  	Product.find().exec({
		error: function(err) {
			console.log('"Errro admin.getProducts: ' + err);
			addProductsFromFile();
		},
		success: function(products) {
			if(!products || products.length === 0) {
				addProductsFromFile();
			}
		}
	});

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
