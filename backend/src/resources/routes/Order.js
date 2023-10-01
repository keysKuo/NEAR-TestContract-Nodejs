const router = require('express').Router();
const { API_Order } = require('../controllers');

router.get('/', API_Order.find_order_many);
router.get('/:id', API_Order.find_order_by_id);
router.post('/create', API_Order.create_order);
// router.put('/update', API_Order.update_driver);
router.delete('/delete/:id', API_Order.delete_order);

module.exports = router;