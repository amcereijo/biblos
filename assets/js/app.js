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
	  	},
	  	setFirstProductSelected = function() {
	  		controller.formData.selectedProduct = 0;
		};

	controller.formData = {};
	controller.formData.products = [];
	controller.formData.showAllProducts = false;
	controller.formData.selectedProduct;//- selecciona producto -';
	controller.formData.productAmount = 1;
	controller.formData.orders = [];
	controller.formData.orderTableDisabled = true;
	controller.formData.showClientData = '';
	controller.formData.clientName = '';
	controller.formData.clientComments = '';

	controller.passToClientData = function(show) {
		controller.formData.showClientData = show;
	}

	controller.init = function (dataUpdate) {
		var storeDataUpdate = (localStorage && localStorage.dataUpdate) ? localStorage.dataUpdate : 0;
		if(dataUpdate != storeDataUpdate) {
			
			//retrieve products
			io.socket.get('/product', function(data) {
				controller.formData.products = data;
				setFirstProductSelected();
				controller.$apply();
				localStorage.setItem('dataUpdate',dataUpdate);
				localStorage.setItem('products', JSON.stringify(data));
			});

			//listen changes
			io.socket.on('product', function(evt)  {
				switch(evt.verb){
					case 'created':
						controller.formData.products.push(evt.data);
						setFirstProductSelected();
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
						setFirstProductSelected();
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
		setFirstProductSelected();
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


	controller.checkOwnData = function(evt) {
		return (controller.formData.clientName === '' ||
			controller.formData.clientComments === '');
	}
	controller.makeOrder = function(evt) {
		var md = $mdToast,
			position = getToastPosition(),
			hideClientData = controller.passToClientData;

		showConfirm(evt, function(){
			hideClientData(false);
			//$http post order
			
			var req = {
				method: 'POST',
				url: '/order',
				headers: {
				},
				data: {
					products: controller.formData.orders,
					clientName: controller.formData.clientName,
					comments: controller.formData.clientComments
				}
			};
			$http(req).then(
				function() {
					controller.formData.orders = [];
					controller.formData.clientName = '';
					controller.formData.clientComments = '';

					md.show(
				      md.simple()
				        .content('Pedido realizado!')
				        .position(position)
				        .hideDelay(2000)
				    );
					//show confirmation	
					console.log('POST SUCCESS!!')

				}, 
				function(err) {
					console.log("POST ERROR!! : %s", err);
				}
			);


		}, function(){/*do nothing*/});

	}

	controller.changeAmmount = function(value) {
		controller.formData.productAmount += value;
	}



	
}]);