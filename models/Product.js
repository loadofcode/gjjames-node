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
    photo: {
        type: String,
        required: 'Please choose a photo to upload'
    }
});

productSchema.pre('save', function(next) {
    if (!this.isModified('productName')) {
        return next();
    }
    this.slug = slug(this.productName);
    next();

    // TODO make more resilitent so slugs are unique
})

module.exports = mongoose.model('Product', productSchema);