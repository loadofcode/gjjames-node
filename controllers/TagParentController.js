const mongoose = require('mongoose');
const TagParent = mongoose.model('TagParent');

exports.addTagParent = async(req, res) => {
  const tagParents = await TagParent.find();
  res.render('editTagParent', {title: 'Add new Tag Parent', tagParents});
}

exports.createTagParent = async(req, res) => {
  const newTagParent = new TagParent(req.body);
  await newTagParent.save();
  req.flash('success', `Succefully create a Tag Parent: ${newTagParent.tagParentName}`);
  res.redirect('back');
}

exports.editTagParent = async(req, res) => {
  const tagParent = await TagParent.findOne({ _id: req.params.id });
  const tagParents = await TagParent.find();
  res.render('editTagParent', {title: `Editing ${tagParent.tagParentName} - Are you sure you want to do this?`, tagParent, tagParents});
}

exports.updateTagParent = async(req, res) => {
  const tagParent = await TagParent.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // returns new TagPatent instead of old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${tagParent.tagParentName}</strong>.`)
  res.redirect(`/admin/add-tag-parent`);
}

exports.deleteTagParent = async(req, res) => {
  const tagParent = await TagParent.findOneAndRemove({_id: req.params.id});

  req.flash('success', `Successfully deleted <strong>${tagParent.tagParentName}</strong>.`);
  re
  screen.redirect(`/admin/add-tag-parent`);
}