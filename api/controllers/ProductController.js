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

function saveInFileProduct(products) {
	var product;
	fs.writeFile('products.json', JSON.stringify(products), function (err) {
  		if (err) throw err;
  		console.log('It\'s saved!');
	});
	fs.readFile('products.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  console.log('Readed:',JSON.parse(data));
	});
}

function createProducts(uploadedFile, res) {
	console.log('file: ' + JSON.stringify(uploadedFile));
	var rdInstance = readline.createInterface({
	    input: fs.createReadStream(uploadedFile.fd),
	    output: process.stdout,
	    terminal: false
	});
	var productsObject = [];

	rdInstance.on('line', function(line) {
	    var data = line.split(':'),
		    productName = data[0].trim(),
		    price = data[1].trim(),
		    desc = (data[2] || '').trim(),
		    product;

	    console.log('Product:%s - Price:%s', productName, price);
	    product = {name: productName, price: price, desc: desc};
	    productsObject.push(product);
		Product.create(product).exec(function createCB(err, createdProduct){
		  console.log('Created product: %s' + JSON.stringify(createdProduct));
		});
	});

	rdInstance.on('close', function(line) {
		saveInFileProduct(productsObject);
	    console.log('END!!');
	    res.redirect('/admin/product');
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
	}
};

