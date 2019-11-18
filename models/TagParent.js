const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const tagParentSchema = new mongoose.Schema({
  tagParentName: {
    type:String,
    trim: true,
    required: 'Please add a Tag Parent'
  },
  tags: [String],
})

module.exports = mongoose.model('TagParent', tagParentSchema);