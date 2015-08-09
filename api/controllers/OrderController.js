/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function mapOrders(orders) {
	orders.map(function(order) {
		var total = 0,
			i = 0, 
			l = order.products.length,
			d = new Date(order.createdAt),
			stringDate = [d.getHours(), ':', 
				(d.getMinutes()<10? '0'+d.getMinutes():d.getMinutes()), 
				' del dia ',
				d.getUTCDate(), '/', (d.getUTCMonth() +1), '/', d.getUTCFullYear()].join('');
		order.createdAt = stringDate;
		 
		for(i=0;i<l;i++) {
			total += order.products[i].product.price;
		}
		order.total = total;
		return order;
	});
	return orders;
}

function loadAndShowOrders(res) {
	Order.find().exec({
		error: function(err) {
			console.log('"Error admin show orders: ' + err);
			res.view('ordersadmin.ejs', {orders: []});
		},
		success: function(orders) {
			orders = mapOrders(orders);
			res.view('ordersadmin.ejs', {orders: orders});
		}
	});
}

module.exports = {
	admin: function(req, res) {
		loadAndShowOrders(res);
	}
};

