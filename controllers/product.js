/** @format */
const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
	res.render("add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		productCSS: true,
		formCSS: true,
		activeAddProduct: true,
	});
};

exports.postProduct = (req, res, next) => {
	const product = new Product(req.body.title);
	product.saveProduct();
	res.redirect("/");
};

exports.getProduct = (req, res, next) => {
	const products = Product.getAllProduct();

	res.render("shop", {
		prods: products,
		pageTitle: "Shop",
		path: "/",
		hasProduct: products.length > 0,
		activeShop: true,
		productCSS: true,
	});
};
