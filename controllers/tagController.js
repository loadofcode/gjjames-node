const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

exports.addTag = async (req, res) => {
    const tags = await Tag.find();
    res.render('editTag', { title: 'Add new Tag', tags });
}

exports.createTag = async (req, res) => {
    const newTag = new Tag(req.body);
    await newTag.save()
    req.flash('success', `Successfully created Tag: ${newTag.tagName}`);
    res.redirect('/admin');
}

exports.editTag = async (req, res) => {
    const tag = await Tag.findOne({ _id: req.params.id });
    const tags = await Tag.find();
    res.render('editTag', { title: `Editing ${tag.tagName} - Are sure you want to do this ?`, tag, tags });
}

exports.updateTag = async (req, res) => {
    const tag = await Tag.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // returns new category instead of old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${tag.tagName}</strong>.`)
    res.redirect(`/admin/add-tag`);
}