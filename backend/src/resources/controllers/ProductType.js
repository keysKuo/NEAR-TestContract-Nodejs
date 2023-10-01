const db = require('../../config/db');
const { data_handling } = require('../utils');
const { uuid } = require('uuidv4');

const controller = {
    find_product_type_by_id: async (req, res, next) => {
        const { id } = req.params;
        let sSQL = `Select * From __Product_Type Where type_id = '${id}'`;
        return data_handling(req, res, sSQL);
    },

    find_product_type_many: async (req, res, next) => {
        const { type_id, type_name } = req.query;
        let sSQL = `Select * From __Product_Type`;

        if ( type_id !== undefined && type_name !== undefined) {
            sSQL += ` Where type_id = '${type_id}' And type_name = N'${type_name}'`;
        }
        else if (type_id !== undefined) {
            sSQL += ` Where type_id = '${type_id}'`;
        }
        else if (type_name !== undefined) {
            sSQL += ` Where type_name = N'${type_name}'`;
        }
        
        return data_handling(req, res, sSQL);

    },

    create_product_type: async (req, res, next) => {
        const { type_name } = req.body;

        let data_set = await db.Query(`SELECT * FROM __Product_Type Where type_name = N'${type_name}'`);
        if (data_set.length != 0) {
            return res.status(300).json({
                success: false,
                message: 'Product type existed'
            })
        }

        const type_id = 'R' + uuid().substring(0,5).toUpperCase();
        return await db.ExecProc({
            procedure: `PROC_INSERT_PRODUCT_TYPE '${type_id}', N'${type_name}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Product type inserted successfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    update_product_type: async (req, res, next) => {
        const { type_id, type_name } = req.body;
        let data_set = await db.Query(`Select * From __Product_Type Where type_id = '${type_id}'`) ;
        let product_type = data_set[0];
        if (!product_type) {
            return res.status(404).json({
                success: false,
                message: 'Product type not found'
            })
        }

        let new_typename = type_name || product_type.type_name;

        return await db.ExecProc({
            procedure: `PROC_UPDATE_PRODUCT_TYPE '${type_id}', N'${new_typename}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Product type updated successfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    delete_product_type: async (req, res, next) => { 
        const { type_id } = req.params;
        
        let data_set = await db.Query(`Select * From __Product_Type Where type_id = '${type_id}'`);
        if (data_set.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Product type not found'
            })
        }

        return await db.ExecProc({
            procedure: `PROC_DELETE_PRODUCT_TYPE '${type_id}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Product type deleted successfully'
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