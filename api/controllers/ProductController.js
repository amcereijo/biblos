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


function createProducts(uploadedFile, res) {
	console.log('file: ' + JSON.stringify(uploadedFile));
	var rdInstance = readline.createInterface({
	    input: fs.createReadStream(uploadedFile.fd),
	    output: process.stdout,
	    terminal: false
	});
	var productsSize = 0;
	var productsInserted = 0;

	rdInstance.on('line', function(line) {
	    var data = line.split(':'),
		    productName = data[0].trim(),
		    price = data[1].trim(),
		    desc = (data[2] || '').trim(),
		    product;

	    console.log('Product:%s - Price:%s', productName, price);
	    product = {name: productName, price: price, desc: desc};
	    productsSize++;
		Product.create(product).exec(function createCB(err, createdProduct){
		  console.log('Controllersreated product: %s' + JSON.stringify(createdProduct));
		  productsInserted++;
		  if(productsInserted === productsSize) {
		  	res.redirect('/admin/product');
		  }
		});
	});

	rdInstance.on('close', function(line) {
	    console.log('END!!');
	});
}

function removeAllProducts(uploadedFile, res) {
	Product.destroy({}).exec(function deleteCB(err){
		console.log('The record has been deleted');
		createProducts(uploadedFile, res);
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
				if (err) {
				  return res.negotiate(err);
				}
				// If no files were uploaded, respond with an error.
				if (uploadedFiles.length === 0) {
				  return res.badRequest('No file was uploaded');
				}
				removeAllProducts(uploadedFiles[0], res);
		});
	},
	create: function(req, res) {
		console.log('Create product! ', req.param('name'));
		var product = {
			name: req.param('name'),
			price: req.param('price').replace(',', '.'),
			desc: req.param('desc')
		};
		Product.create(product).exec(function createCB(err, createdProduct){
		  console.log('Controllersreated product: %s' + JSON.stringify(createdProduct));
		  res.redirect('/admin/product');
		});
	},
	deleteProduct: function(req, res) {
		var id = req.param('id');
		Product.destroy({id: id}).exec(function (err) {
			console.log('Delete product');
			res.redirect('/admin/product');
		});
	}
};

