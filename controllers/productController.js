const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
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

exports.adminPage = (req, res) => {
    res.render('admin', { title: 'Admin' });
};
// exports.addProduct = (req, res) => {
//     const category = Category.find();
//     console.log("category", category.categoryName);
//     res.render('editProduct', { title: 'Add Product', category });
// };

exports.addProduct = (req, res) => {
    return Category.find()
        .exec()
        .then(category => {
            res.render('editProduct', {
                title: 'Add Product',
                category: category.map((item, index) => {
                    return item.categoryName.toString();
                })
            });
        })
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
    console.log(req.body)
    const product = await (new Product(req.body)).save();
    console.log('blah')
    req.flash('success', `Successfully added ${product.productName}`);
    res.redirect(`/product/${product.slug}`);
};

// old method for getting products
//
// exports.getProducts = async(req, res) => {
//     const products = await Product.find();
//     res.render('products', { title: 'Products', products });
// }


// new method for getting products with categories as well
exports.getProducts = async(req, res) => {
    const category = req.params.category;
    const categoryPromise = Product.getCategoriesList();
    const productsPromise = Product.find();
    const [categories, products] = await Promise.all([categoryPromise, productsPromise]);
    res.render('products', { categories, title: `Products`, category, products });
}

exports.getProductsByCategory = async(req, res) => {
    const category = req.params.category;
    const categoryQuery = category || { $exists: true };
    const categoriesPromise = Product.getCategoriesList();
    const productsByCategoryPromise = Product.find({ category: categoryQuery });
    const [categories, products] = await Promise.all([categoriesPromise, productsByCategoryPromise]);
    res.render('tag', { categories, title: `Products: ${category}`, category, products });
    console.log(category)
    console.log(products)
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