var params = {
	appId: '',
	httpApiId: '',
	adminUser: 'admin',
	adminPass: 'admin'
};
var key;
console.log('process.env: ', process.env);

for(key in params) {
	if(process.env[key]) {
		params[key] = process.env[key];
	}
}

module.exports = params;