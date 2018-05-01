const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        trim: true,
        required: 'Please add a category name'
    },
    slug: {
        type: String
    }
});

categorySchema.pre('save', async function(next) {
    if (!this.isModified('categoryName')) {
        return next();
    }
    // using SKU for slug now
    this.slug = await slug(this.categoryName).split(' ').join('-');
    // find other products of slug, slug-1, slug-2
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (categoriesWithSlug.length) {
        this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`;
    }

    next();
})

module.exports = mongoose.model('Category', categorySchema);