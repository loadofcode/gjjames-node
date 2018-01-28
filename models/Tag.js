const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const tagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        trim: true,
        required: 'Please add a tag name'
    }
});

module.exports = mongoose.model('Tag', tagSchema);