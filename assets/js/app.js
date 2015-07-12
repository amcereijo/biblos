var biblosapp = angular.module('biblos', []);

biblosapp.controller('MainController',['$http','$scope', function($http, $scope) {
	var controller = $scope;
	controller.products = [];
	controller.showAllProducts = false;
	controller.selectedProduct = '';//- selecciona producto -';
	controller.productAmount = 1;
	controller.orders = [];

	controller.init = function (dataUpdate) {
		var storeDataUpdate = (localStorage && localStorage.dataUpdate) ? localStorage.dataUpdate : 0;
		if(dataUpdate != storeDataUpdate) {
			
			//retrieve products
			io.socket.get('/product', function(data) {
				controller.products = data;
				controller.$apply();
				localStorage.setItem('dataUpdate', dataUpdate);
				localStorage.setItem('products', JSON.stringify(data));
			});

			//listen changes
			io.socket.on('product', function(evt){
				switch(evt.verb){
					case 'created':
						controller.products.push(evt.data);
						controller.$apply();
						localStorage.setItem('dataUpdate', dataUpdate); //TODO
						localStorage.setItem('products', JSON.stringify(data));
						break;
					case 'destroyed': 
						for(var i=0,l=controller.products.length;i<l;i++) {
							if(controller.products[i].id === evt.id) {
								controller.products.splice(i, 1);
								i = l;
							}
						}
						controller.$apply();
						localStorage.setItem('dataUpdate', dataUpdate);//TODO
						localStorage.setItem('products', JSON.stringify(data));
						break;
				}
			});
		} else {
			controller.products = JSON.parse(localStorage.products);
		}
	};

	controller.showHideProducts = function(show) {
		controller.showAllProducts = show;
	};

	controller.addProduct = function() {
		var product = controller.products[controller.selectedProduct],
			order = {
				product: product,
				amount: controller.productAmount
			};
		controller.selectedProduct = '';
		controller.productAmount = 1;
		controller.orders.push(order);
	};

	controller.selectProduct = function(id) {
		//controller.selectAddroduct
		//document.getElementsByName('selectAddProduct').selectedIndex = id;
		controller.selectedProduct = controller.products[id].name + ' - ' + controller.products[id].price +'€'; //{{p.name}} - {{p.price}}€
	}
	
}]);