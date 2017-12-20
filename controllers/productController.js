const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index', { title: 'Home' });
};

exports.addProduct = (req, res) => {
    res.render('editProduct', { title: 'Add Product' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
    if (!req.file) {
        return next();
    }
    // Change image name to UUID
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // Resize image
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // Save file
    next();
};

exports.createProduct = async(req, res) => {
    const product = await (new Product(req.body)).save();
    req.flash('success', `Successfully added ${product.productName}`);
    res.redirect(`/product/${product.slug}`);
};

// exports.getProducts = async(req, res) => {
//     const products = await Product.find();
//     res.render('products', { title: 'Products', products });
// }

exports.getProducts = async(req, res) => {
    const tag = req.params.tag;
    const tagsPromise = Product.getTagsList();
    const productsPromise = Product.find();
    const [tags, products] = await Promise.all([tagsPromise, productsPromise]);
    res.render('products', { tags, title: `Products`, tag, products });
}

exports.getProductsByTag = async(req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = Product.getTagsList();
    const productsByTagPromise = Product.find({ tags: tagQuery });
    const [tags, products] = await Promise.all([tagsPromise, productsByTagPromise]);
    // res.json(products)
    res.render('tag', { tags, title: `Products: ${tag}`, tag, products });
    console.log(tag)
}

exports.getProductBySlug = async(req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return next();
    res.render('product', { product, title: product.productName });
}

exports.editProduct = async(req, res) => {
    const product = await Product.findOne({ _id: req.params.id });

    res.render('editProduct', { title: `Edit ${product.productName}`, product });
}

exports.updateProduct = async(req, res) => {
    const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // returns new product instead of old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${product.productName}</strong>. <a href="/products/${product.slug}">View Product</a>`)
    res.redirect(`/products/${product._id}/edit`);
}