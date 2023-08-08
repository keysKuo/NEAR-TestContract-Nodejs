const router = require('express').Router();
const { API_Driver } = require('../controllers');

router.get('/', API_Driver.find_driver_many);
router.get('/:id', API_Driver.find_driver_by_id);
router.post('/create', API_Driver.create_driver);
router.put('/update', API_Driver.update_driver);
router.delete('/delete/:id', API_Driver.delete_driver);

module.exports = router;