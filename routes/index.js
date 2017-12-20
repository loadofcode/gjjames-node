const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const { catchErrors } = require('../handlers/errorHandlers');

const stock = 'stock123';
const admin = 'admin';

// Product Routes
router.get('/', productController.homePage);
router.get('/products', catchErrors(productController.getProducts));

router.get('/products/c/:category', catchErrors(productController.getProductsByCategory));

router.get('/add', productController.addProduct);

// Add new Product
router.post('/add',
    productController.upload,
    catchErrors(productController.resize),
    catchErrors(productController.createProduct)
);

// Update a Product
router.post('/add/:id',
    productController.upload,
    catchErrors(productController.resize),
    catchErrors(productController.updateProduct)
);

router.get('/products/:id/edit', catchErrors(productController.editProduct));

router.get('/product/:slug', catchErrors(productController.getProductBySlug));


// Category Routes
router.get('/add-category', categoryController.addCategory);
// add new category
router.post('/add-category', catchErrors(categoryController.createCategory));

module.exports = router;