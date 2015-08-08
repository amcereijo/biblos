/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs'),
    readline = require('readline'),
    path = require('path');

function loadAndShowProducts(res) {
	Product.find().exec({
		error: function(err) {
			console.log('"Errro admin.getProducts: ' + err);
		},
		success: function(products) {
			res.view('productsadmin.ejs', {products: products});		
		}
	});
}

module.exports = {

	order: function(req, res) {
		res.view('productsorder.ejs', {
			dataUpdate: new Date().getMilliseconds()
		});
	},

	admin: function(req, res) {
		loadAndShowProducts(res);
	},

	uploadFileProducts: function (req, res) {

		req.file('fileProducts').upload({
				// don't allow the total upload size to exceed ~10MB
				maxBytes: 10000000
			}, function whenDone(err, uploadedFiles) {
				var rdInstance; 
				if (err) {
				  return res.negotiate(err);
				}

				// If no files were uploaded, respond with an error.
				if (uploadedFiles.length === 0){
				  return res.badRequest('No file was uploaded');
				}

				console.log('file: ' + JSON.stringify(uploadedFiles[0]));

				var rdInstance = readline.createInterface({
				    input: fs.createReadStream(uploadedFiles[0].fd),
				    output: process.stdout,
				    terminal: false
				});

				rdInstance.on('line', function(line) {
				    console.log(line);
				    //TODO insert products
				});

				rdInstance.on('close', function(line) {
				    console.log('END!!');
				    res.redirect('/admin/product');
				});				
		});
	}
};

