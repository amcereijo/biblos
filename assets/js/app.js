var biblosapp = angular.module('biblos', ['ngMaterial']);

biblosapp.controller('MainController',['$http','$scope','$mdDialog', '$mdToast', '$animate', function($http, $scope, $mdDialog,$mdToast, $animate) {
	var controller = $scope,
		mdDialog = $mdDialog,
		setOrderTableDisabled = function() {
			controller.formData.orderTableDisabled = (controller.formData.orders.length === 0);
		},
		showConfirm = function(ev, okFn, cancelFn) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    var confirm = mdDialog.confirm()
		      .parent(angular.element(document.body))
		      .title('¿Realizar pedido?')
		      //.content('Vas a pedir: ' + controller.orders)
		      .ok('Si')
		      .cancel('No')
		      .targetEvent(ev);

		    mdDialog.show(confirm).then(okFn, cancelFn);
		},
		toastPosition = {
		    bottom: true,
		    top: false,
		    left: false,
		    right: false
		},
		getToastPosition = function() {
		    return Object.keys(toastPosition)
	    		.filter(function(pos) { return toastPosition[pos]; })
	    		.join(' ');
	  	};
	  	
	controller.formData = {};
	controller.formData.products = [];
	controller.formData.showAllProducts = false;
	controller.formData.selectedProduct = '';//- selecciona producto -';
	controller.formData.productAmount = 1;
	controller.formData.orders = [];
	controller.formData.orderTableDisabled = true;



	controller.init = function (dataUpdate) {
		var storeDataUpdate = (localStorage && localStorage.dataUpdate) ? localStorage.dataUpdate : 0;
		if(dataUpdate != storeDataUpdate) {
			
			//retrieve products
			io.socket.get('/product', function(data) {
				controller.formData.products = data;
				controller.$apply();
				localStorage.setItem('dataUpdate', dataUpdate);
				localStorage.setItem('products', JSON.stringify(data));
			});

			//listen changes
			io.socket.on('product', function(evt) {
				switch(evt.verb){
					case 'created':
						controller.formData.products.push(evt.data);
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

	controller.addProduct = function() {
		var product = controller.formData.products[controller.formData.selectedProduct],
			order = {
				product: product,
				amount: controller.formData.productAmount
			};
		controller.formData.selectedProduct = '';
		controller.formData.productAmount = 1;
		controller.formData.orders.push(order);
		setOrderTableDisabled();

	};

	controller.selectProduct = function(id) {
		controller.formData.selectedProduct = ""+id;
		controller.formData.showAllProducts = false;
	};

	controller.removeProduct = function(order) {
		controller.formData.orders.pop(order);
		setOrderTableDisabled();
	};

	controller.makeOrder = function(evt) {
		var md = $mdToast,
			position = getToastPosition();
		showConfirm(evt, function(){
			//$http post order
			controller.orders = [];
			md.show(
		      md.simple()
		        .content('Pedido realizado!')
		        .position(position)
		        .hideDelay(2000)
		    );
			//show confirmation	
		}, function(){/*do nothing*/});

	}



	
}]);