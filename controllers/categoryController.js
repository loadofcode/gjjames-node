const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.addCategory = (req, res) => {
    res.render('editCategory', { title: 'Add a new Category' });
}

exports.createCategory = async(req, res) => {
    // res.json(req.body)
    const newCategory = new Category(req.body);
    await newCategory.save()
    req.flash('success', `Successfully created category: ${newCategory.categoryName}`);
    res.redirect('back');
}