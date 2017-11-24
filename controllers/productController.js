const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index', {title: 'Home'});
};

exports.addProduct = (req, res) => {
    res.render('editProduct', { title: 'Add Product'});
};

exports.createProduct = async (req, res) => {
    const product = await (new Product(req.body)).save();
    req.flash('success', `Successfully added ${product.productName}`);
    res.redirect(`/product/${product.slug}`);
};

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.render('products', {title: 'Products', products});
}

exports.editProduct = async (req, res) => {
    const product = await Product.findOne({_id: req.params.id});
    
    res.render('editProduct', {title: `Edit ${product.productName}`, product});
}

exports.updateProduct = async (req, res) => {
    const product = await Product.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true, // returns new product instead of old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${product.productName}</strong>. <a href="/products/${product.slug}">View Product</a>`)
    res.redirect(`/products/${product._id}/edit`);
}