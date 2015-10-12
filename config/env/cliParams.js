var params = {} ;

process.argv.forEach(function (val, index, array) {
	var pos = val.indexOf('=');
	var name;
	var value;
	if(pos > 0) {
		name = val.substring(0, pos);
		value = val.substring(pos +1);
		params[name] = value;
	}
});

module.exports = params;