const router = require('express').Router();
const { API_Vehicle } = require('../controllers');

router.get('/', API_Vehicle.find_vehicle_many);
router.get('/:id', API_Vehicle.find_vehicle_by_id);
router.post('/create', API_Vehicle.create_vehicle);
router.put('/update', API_Vehicle.update_vehicle);
router.delete('/delete/:id', API_Vehicle.delete_vehicle);

module.exports = router;