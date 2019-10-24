const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const TagParent = mongoose.model('TagParent');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const mail = require('../handlers/mail');

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

exports.productEnquiry = async (req, res) => {
    const productSlug = req.params.slug;
    const customerName = req.body.name.trim()
    const customerEmail = req.body.email.trim()
    const customerTelephone = req.body.telephone.trim()
    const customerCompany = req.body.company.trim()
    const customerMessage = req.body.message
    const productSKU = req.body.product
    await mail.send({
        from: 'info@gjjames.co.uk',
        replyTo: customerEmail,
        to: 'gareth@gjjames.co.uk',
        subject: `Product enquiry for ${productSKU}`,
        customerName,
        customerTelephone,
        customerCompany,
        customerMessage,
        productSKU,
        customerEmail,
        filename: 'product-enquire'
      })
    req.flash('success', `Thanks for your enquiry. We'll be in touch soon`);
}

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
    res.redirect(`/stock1234/product/${product.slug}`);
};

// new method for getting products with categories as well
exports.getProducts = async(req, res) => {
    const page = req.params.page || 1;
    const limit = 50;
    const skip = (page * limit) - limit;
    const categoryPromise = Product.getCategoriesList();
    const categoriesLink = await Category.find();
    const tags = req.query.tags;
    const tagQuery = tags || { $exists: true }
    const tagPromise = Product.getTagsList();
    const tagParentPromise = TagParent.find()
    const countPromise = Product.count();

    const productsByTagPromise = Product
    .find({ tags: {$in: tagQuery}})
    .sort({SKU: 'desc'});

    const productsAllPromise = Product
    .find()
    .skip(skip)
    .limit(limit)
    .sort({SKU: 'desc'});
    
    const productsPromise = !tags ? productsAllPromise : productsByTagPromise
    const [categories, products, tagsList, tagParents, count] = await Promise.all(
        [
            categoryPromise,
            productsPromise,
            tagPromise,
            tagParentPromise,
            countPromise,
        ]);

    const pages = Math.ceil(count / limit);
    if (!products.length && skip) {
        req.flash('info', `${page} doesn't exist, you've been redirected to ${pages}`);
        res.redirect(`/stock1234/products/page/${pages}`)
        return
    }
    res.render('products', { categoriesLink, categories, tagsList, tagParents, title: `Products`, products, count, pages, page });
}

exports.getProductsByCategory = async(req, res) => {
    const category = req.params.category;
    const title = `category: ${category}s`
    const categoryQuery = category || { $exists: true };
    const tags = req.query.tags;
    const tagQuery = tags || { $exists: true }
    const categoriesPromise = Product.getCategoriesList();

    const productsByCategoryWithTagPromise = Product
    .find({ category: categoryQuery, tags: {$in: tagQuery}})
    .sort({SKU: 'desc'});

    const productsByCategoryPromise = Product
        .find({ category: categoryQuery })
        .sort({SKU: 'desc'});

    const productsPromise = !tags ? productsByCategoryPromise : productsByCategoryWithTagPromise
    const [categories, products] = await Promise.all([categoriesPromise, productsPromise]);
    res.render('tag', { categories, title, category, products });
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
    req.flash('success', `Successfully updated <strong>${product.productName}</strong>. <a href="/stock1234/product/${product.slug}">View Product</a>`)
    res.redirect(`/stock1234/products/${product._id}/edit`);
}

exports.deleteProduct = async (req, res) => {
    const product = await Product.findOneAndRemove({ _id: req.params.id });

    req.flash('success', `Successfully deleted <strong>${product.productName}</strong>.`)
    res.redirect(`/stock1234/products`);
}

exports.searchProducts = async (req, res) => {
    const products = await Product
    // first find products that match
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
