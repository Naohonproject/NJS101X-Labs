/** @format */
const products = [];

class Product {
	constructor(title) {
		this.title = title;
	}
	saveProduct() {
		products.push(this);
	}
	static getAllProduct() {
		return products;
	}
}

module.exports = Product;
