const router = require('express').Router();
const { API_ProductType } = require('../controllers');

router.get('/', API_ProductType.find_product_type_many);
router.get('/:id', API_ProductType.find_product_type_by_id);
router.post('/create', API_ProductType.create_product_type);
router.put('/update', API_ProductType.update_product_type);
router.delete('/delete/:id', API_ProductType.delete_product_type);

module.exports = router;
