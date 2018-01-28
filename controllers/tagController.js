const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

exports.addTag = (req, res) => {
    res.render('editTag', { title: 'Add new Tag' });
}

exports.createTag = async(req, res) => {
    const newTag = new Tag(req.body);
    await newTag.save()
    req.flash('success', `Successfully created Tag: ${newTag.tagName}`);
    res.redirect('/admin');
}