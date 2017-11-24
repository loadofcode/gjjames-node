const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', productController.homePage);
router.get('/products', catchErrors(productController.getProducts));
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

module.exports = router;