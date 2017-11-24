const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', productController.homePage);
router.get('/products', catchErrors(productController.getProducts));
router.get('/add', productController.addProduct);
router.post('/add', catchErrors(productController.createProduct));
router.post('/add/:id', catchErrors(productController.updateProduct));
router.get('/products/:id/edit', catchErrors(productController.editProduct));

module.exports = router;