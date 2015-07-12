/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	order: function(req, res) {
		res.view('productsorder.ejs', {
			dataUpdate: new Date().getMilliseconds()
		});
	},

	admin: function(req, res) {
		Product.find().exec({
			error: function(err) {
				console.log('"Errro admin.getProducts: ' + err);
			},
			success: function(products) {
				res.view('productsadmin.ejs', {products: products});		
			}
		});
		
	}
};

