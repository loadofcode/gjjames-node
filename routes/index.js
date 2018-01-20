const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const stock = 'stock123';
const admin = 'admin';

// Main routes
router.get('/', productController.homePage);
router.get('/admin', productController.adminPage);


// Product Routes
router.get('/products', catchErrors(productController.getProducts));
router.get('/products/c/:category', catchErrors(productController.getProductsByCategory));
router.get('/admin/add-product', productController.addProduct);

// Add new Product
router.post('/admin/add-product',
    productController.upload,
    catchErrors(productController.resize),
    catchErrors(productController.createProduct)
);

// Update a Product
router.post('/admin/add-product/:id',
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

// Login and Register and Logout
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.post('/register', 
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logout', authController.logout);

module.exports = router;