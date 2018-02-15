const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
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

exports.addProduct = async (req, res) => {
    const categoriesPromise = Category.find();
    const tagsPromise = Tag.find();
    const [categories, tags] = await Promise.all([categoriesPromise, tagsPromise]);
    const category = categories.map((category) => {
        return category.categoryName.toString();
    })
    const tag = tags.map((tag) => {
        return tag.tagName.toString()
    })
    res.render('editProduct', {title: 'Add New Product', category, tag} )

}


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

// old method for getting products
//
// exports.getProducts = async(req, res) => {
//     const products = await Product.find();
//     res.render('products', { title: 'Products', products });
// }

// new method for getting products with categories as well
exports.getProducts = async(req, res) => {
    const page = req.params.page || 1;
    const limit = 50;
    const skip = (page * limit) - limit;
    const category = req.params.category;
    const categoryPromise = Product.getCategoriesList();
    const tagPromise = Product.getTagsList();
    const countPromise = Product.count();
    const productsPromise = Product
        .find()
        .skip(skip)
        .limit(limit)
        .sort({SKU: 'desc'})

    const [categories, products, tags, count] = await Promise.all([categoryPromise, productsPromise, tagPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if (!products.length && skip) {
        req.flash('info', `${page} doesn't exist, you've been redirected to ${pages}`);
        res.redirect(`/products/page/${pages}`)
        return
    }
    res.render('products', { categories, tags, title: `Products`, products, count, pages, page });
}

exports.getProductsByCategory = async(req, res) => {
    const category = req.params.category;
    const categoryQuery = category || { $exists: true };
    const categoriesPromise = Product.getCategoriesList();
    const productsByCategoryPromise = Product.find({ category: categoryQuery });
    const [categories, products] = await Promise.all([categoriesPromise, productsByCategoryPromise]);
    res.render('tag', { categories, title: `Products: ${category}`, category, products });
}

exports.getProductBySlug = async(req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return next();
    res.render('product', { product, title: product.productName });
}

exports.editProduct = async(req, res) => {
    const productPromise = Product.findOne({ _id: req.params.id });
    const categoriesPromise = Category.find();
    const tagsPromise = Tag.find();
    const [categories, tags, product] = await Promise.all([categoriesPromise, tagsPromise, productPromise]);
    const category = categories.map((category) => {
        return category.categoryName.toString();
    })
    const tag = tags.map((tag) => {
        return tag.tagName.toString()
    })
    

    res.render('editProduct', { title: `Edit ${product.productName}`, product, category, tag });
}

exports.updateProduct = async(req, res) => {
    const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // returns new product instead of old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${product.productName}</strong>. <a href="/product/${product.slug}">View Product</a>`)
    res.redirect(`/products/${product._id}/edit`);
}

exports.searchProducts = async (req, res) => {
    const products = await Product
    // first find stores that match
    .find({
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore' }
    })
    // sort the results
    .sort({
        score: { $meta: 'textScore' } // sort the returned results by score value
    })
    // limit to 50 items
    .limit(5)
    res.json(products)
}
