/** @format */
const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "products.json");

const getProductFromFile = (callback) => {
	fs.readFile(p, (err, content) => {
		if (err) return callback([]);
		callback(JSON.parse(content));
	});
};

class Product {
	constructor(title) {
		this.title = title;
	}
	saveProduct() {
		getProductFromFile((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}
	static getAllProduct(callback) {
		getProductFromFile(callback);
	}
}

module.exports = Product;
