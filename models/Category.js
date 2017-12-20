const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        trim: true,
        required: 'Please add a category name'
    }
});

module.exports = mongoose.model('Category', categorySchema);