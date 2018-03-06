const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.addCategory = async (req, res) => {
    const categories = await Category.find();
    res.render('editCategory', { title: 'Add new Category', categories });
}

exports.createCategory = async(req, res) => {
    // res.json(req.body)
    const newCategory = new Category(req.body);
    await newCategory.save()
    req.flash('success', `Successfully created category: ${newCategory.categoryName}`);
    res.redirect('back');
}

exports.editCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    const categories = await Category.find();
    res.render('editCategory', { title: `Editing ${category.categoryName} - Are sure you want to do this ?`, category, categories });
}

exports.updateCategory = async(req, res) => {
    const category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // returns new category instead of old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${category.categoryName}</strong>.`)
    res.redirect(`/admin/add-category`);
}