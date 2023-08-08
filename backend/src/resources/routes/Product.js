const router = require('express').Router();
const { API_Product } = require('../controllers');

router.get('/', API_Product.find_product_many);
router.get('/:id', API_Product.find_product_by_id);
router.post('/create', API_Product.create_product);
router.put('/update', API_Product.update_product);
router.delete('/delete/:id', API_Product.delete_product);

module.exports = router;
