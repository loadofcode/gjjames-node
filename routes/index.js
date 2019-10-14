// import { recentlyViewed } from '../controllers/productController';

const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const tagController = require('../controllers/tagController');
const tagParentController = require('../controllers/tagParentController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const stock = 'stock123';
const admin = 'admin';

// Main routes
router.get('/stock1234', pageController.homePage);
router.get('/admin', 
    authController.isAdminLoggedIn,
    pageController.adminPage
);

router.get('/stock1234/privacy-policy', pageController.privacyPage)
router.get('/stock1234/contact', pageController.contactPage)

router.get('/', pageController.emailPage);

router.post('/contact/success', catchErrors(pageController.websiteEnquiry))
router.post('/contact-page/success', catchErrors(pageController.contactPageForm))
router.post('/product-enquire/success', catchErrors(productController.productEnquiry))


// Product Routes
//
//////////////////
router.get('/stock1234/products', catchErrors(productController.getProducts));
router.get('/stock1234/products/page/:page', catchErrors(productController.getProducts));
router.get('/stock1234/products/c/:category', catchErrors(productController.getProductsByCategory));
router.get('/stock1234/products/t/:tags', catchErrors(productController.getProductsByTags));
router.get('/admin/add-product',
    authController.isAdminLoggedIn,
    productController.addProduct
);
// Add new Product
router.post('/admin/add-product',
    authController.isAdminLoggedIn,
    productController.upload,
    catchErrors(productController.resize),
    catchErrors(productController.createProduct)
);
// Update a Product
router.post('/admin/add-product/:id',
    authController.isAdminLoggedIn,
    productController.upload,
    catchErrors(productController.resize),
    catchErrors(productController.updateProduct)
);
router.get('/stock1234/products/:id/edit', catchErrors(productController.editProduct));
router.get('/stock1234/product/:slug', catchErrors(productController.getProductBySlug));
router.get('/products/:id/delete', catchErrors(productController.deleteProduct));


// Category Routes
//
//////////////////
router.get('/admin/add-category',
    authController.isAdminLoggedIn,
    categoryController.addCategory
);
router.post('/admin/add-category',
    authController.isAdminLoggedIn,
    catchErrors(categoryController.createCategory)
);
router.get('/categories/:id/edit', catchErrors(categoryController.editCategory));
router.post('/admin/add-category/:id',
    catchErrors(categoryController.updateCategory)
);
router.get('/category/:id/delete', catchErrors(categoryController.deleteCategory));



// Tag Routes
//
//////////////////
router.get('/admin/add-tag',
    authController.isAdminLoggedIn,
    tagController.addTag
);
router.post('/admin/add-tag',
    authController.isAdminLoggedIn,
    catchErrors(tagController.createTag)
);
router.get('/tags/:id/edit', catchErrors(tagController.editTag));
router.post('/admin/add-tag/:id',
    catchErrors(tagController.updateTag)
);
router.get('/tag/:id/delete', catchErrors(tagController.deleteTag));

// Tag Parent Routes
//
//////////////////
router.get('/admin/add-tag-parent',
    authController.isAdminLoggedIn,
    tagParentController.addTagParent
);
router.post('/admin/add-tag-parent',
    authController.isAdminLoggedIn,
    catchErrors(tagParentController.createTagParent)
);
router.get('/tag-parents/:id/edit', catchErrors(tagParentController.editTagParent));
router.post('/admin/add-tag-parent/:id',
    catchErrors(tagParentController.updateTagParent)
);
router.get('/tag-parent/:id/delete', catchErrors(tagParentController.deleteTagParent));


// Admin Add User Route
router.get('/admin/add-user',
    authController.isAdminLoggedIn,
    userController.addUser
);

// Login and Register and Logout
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logout', authController.logout);

// My Account section
router.get('/admin/account',
    authController.isAdminLoggedIn,
    userController.account
);
router.post('/admin/account',
    catchErrors(userController.updateAccount)
);

// API Endpoints
router.get('/api/search', catchErrors(productController.searchProducts))


router.post('/account/forgot', catchErrors(authController.forgot))
router.get('/account/reset/:token', catchErrors(authController.reset))
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
)

module.exports = router;