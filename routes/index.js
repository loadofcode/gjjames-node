const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
// res.render('hello', { 
//     name: 'wes',
//     dog: 'dix'
// })
    res.render('hello')
})
router.get('/admin', (req, res) => {
    res.render('admin')
})

module.exports = router;
