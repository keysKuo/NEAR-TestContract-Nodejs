const db = require('../../config/db');
const { data_handling } = require('../utils');
const { uuid } = require('uuidv4');

const controller = {
    // Find a single vehicle by its id
    // @param {String} id
    find_vehicle_by_id: async (req, res, next) => {
        const { id } = req.params;
        const sSQL = `Select * From _Vehicle Where vehicle_id = '${id}'`;
        return await data_handling(req, res, sSQL);
    },

    // Find many vehicles by type or status or both 
    // @param {String} type 
    // @param {String} status
    find_vehicle_many: async (req, res, next) => {
        const { type, status } = req.query;
        let sSQL = 'Select * From _Vehicle';
        
        if (type !== undefined && status !== undefined) {
            sSQL += ` Where vehicle_type = '${type}' And status = '${status}'`;
        }
        else if (type !== undefined) {
            sSQL += ` Where vehicle_type = '${type}'`;
        }
        else if (status !== undefined) {
            sSQL += ` Where status = '${status}'`;
        }
        // console.log(sSQL);
        return data_handling(req, res, sSQL);  
    },

    // Create new vehicle
    // @param {String} type
    // @param {String} num
    create_vehicle: async (req, res, next) => {
        const { type, num } = req.body;
        
        let data_set = await db.Query(`Select * From _Vehicle Where vehicle_num = '${num}'`);
        if (data_set.length != 0) {
            return res.status(300).json({
                success: false,
                message: 'Vehicle existed'
            })
        }
        
        const vehicle_id = 'VH' + uuid().substring(0, 7).toUpperCase();
        return await db.ExecProc({
            procedure: `PROC_INSERT_VEHICLE '${vehicle_id}', '${type}', '${num}', 'ready'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: `Vehicle Inserted`
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    // Update vehicle
    // @param {String} type
    // @param {String} num
    // @param {String} status
    update_vehicle: async (req, res, next) => {
        const { id, type, num, status } = req.body;
        let data_set = await db.Query(`Select * From _Vehicle Where vehicle_id = '${id}'`);
        let vehicle = data_set[0];
        if(!vehicle) {
            return res.status(404).json({
                success: false,
                message: `Vehicle not found`
            })
        }

        let new_type = type || vehicle.vehicle_type;
        let new_num = num || vehicle.vehicle_num;
        let new_status = status || vehicle.status;

        return await db.ExecProc({
            procedure: `PROC_UPDATE_VEHICLE '${id}', '${new_type}', '${new_num}', '${new_status}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: `Vehicle updated successfully`
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
        
    },

    // Delete vehicle 
    // @param {string} id
    delete_vehicle: async (req, res, next) => {
        const { id } = req.params;
        
        const data_set = await db.Query(`Select * From _Vehicle Where vehicle_id = '${id}'`);
        if (data_set.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            })
        }

        return await db.ExecProc({
            procedure: `PROC_DELETE_VEHICLE '${id}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Vehicle deleted successfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    }
}

module.exports = controller;