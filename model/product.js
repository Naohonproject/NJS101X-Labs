/** @format */
const fs = require("fs");
const path = require("path");

class Product {
	constructor(title) {
		this.title = title;
	}
	saveProduct() {
		const p = path.join(path.dirname(require.main.filename), "data", "products.json");
		fs.readFile(p, (err, content) => {
			let products = [];
			if (!err) {
				products = JSON.parse(content);
			}
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}
	static getAllProduct() {
		const p = path.join(path.dirname(require.main.filename), "data", "products.json");
		fs.readFile(p, (err, content) => {
			if (err) return [];
			return JSON.parse(content);
		});
	}
}

module.exports = Product;
