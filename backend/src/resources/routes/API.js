const router = require('express').Router();

router.use('/vehicles', require('./Vehicle'));
router.use('/drivers', require('./Driver'));
router.use('/products', require('./Product'));
router.use('/product_types', require('./ProductType'));

module.exports = router;