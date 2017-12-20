const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: 'Please enter a product name'
    },
    SKU: {
        type: String,
        trim: true,
        required: 'Please enter a SKU code'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    category: {
        type: String,
        required: 'Please choose a category for this product'
    },
    photo: {
        type: String,
        required: 'Please choose a photo to upload'
    }
});

productSchema.pre('save', async function(next) {
    if (!this.isModified('productName')) {
        return next();
    }
    this.slug = slug(this.productName);
    // find other products of slug, slug-1, slug-2
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const productsWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (productsWithSlug.length) {
        this.slug = `${this.slug}-${productsWithSlug.length + 1}`;
    }

    next();
})

productSchema.statics.getTagsList = function() {
    // mongoDB aggregate pipeline
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }

    ]);
}

productSchema.statics.getCategoriesList = function() {
    // mongoDB aggregate pipeline
    return this.aggregate([
        { $unwind: '$category' },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }

    ]);
}

module.exports = mongoose.model('Product', productSchema);