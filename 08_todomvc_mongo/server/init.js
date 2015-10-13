// --------------------------------------------

var iPhone = new Product({
	name: 'iPhone 6s',
	price: 800
});

var onePlus = new Product({
	name: 'OnePlus',
	price: 400
});

iPhone.save(function(err) {
	if (err) {
		console.log('failed' + err);
	}
	console.log('saved');
});

onePlus.save(function(err) {
	if (err) {
		console.log('failed' + err);
	}
	console.log('saved');
});

// --------------------------------------------

