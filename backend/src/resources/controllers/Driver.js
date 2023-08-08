const db = require('../../config/db');
const { data_handling } = require('../utils');
const { uuid } = require('uuidv4');

const controller = {
    find_driver_by_id: async (req, res, next) => {
        const { id } = req.params;
        let sSQL = `Select * From _Driver Where driver_id = '${id}'`;
        return data_handling(req, res, sSQL);
    },

    find_driver_many: async (req, res, next) => {
        const { name, status } = req.query;
        let sSQL = `Select * From _Driver`;
        
        if (name !== undefined && status !== undefined) {
            sSQL += ` Where name = N'${name}' And status = '${status}'`;
        } 
        else if (name !== undefined) {
            sSQL += ` Where name = N'${name}'`;
        }
        else if (status !== undefined) {
            sSQL += ` Where status = '${status}'`;
        }

        return data_handling(req, res, sSQL);
    },

    create_driver: async (req, res, next) => {
        const { name, contact_info, license_number } = req.body;

        let data_set = await db.Query(`Select * From _Driver Where license_number = '${license_number}'`);
        if (data_set.length != 0) {
            return res.status(300).json({
                success: false,
                message: 'Driver existed'
            })
        }

        const driver_id = 'DR' + uuid().substring(0,5).toUpperCase();
        return await db.ExecProc({
            procedure: `PROC_INSERT_DRIVER '${driver_id}', N'${name}', N'${contact_info}', '${license_number}', 'ready'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Driver Inserted'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    update_driver: async (req, res, next) => {
        const { id, name, contact_info, license_number, status } = req.body;
        let data_set = await db.Query(`Select * From _Driver Where driver_id = '${id}'`);
        let driver = data_set[0];
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            })
        }

        let new_name = name || driver.name;
        let new_contact = contact_info || driver.contact_info;
        let new_license = license_number || driver.license_number;
        let new_status = status || driver.status;

        return await db.ExecProc({
            procedure: `PROC_UPDATE_DRIVER '${id}', N'${new_name}', N'${new_contact}', '${new_license}', '${new_status}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Driver updated sucessfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    delete_driver: async (req, res, next) => {
        const { id } = req.params;

        const data_set = await db.Query(`Select * From _Driver Where driver_id = '${id}'`);
        if (data_set.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            })
        }

        return await db.ExecProc({
            procedure: `PROC_DELETE_DRIVER '${id}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Driver deleted successfully'
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