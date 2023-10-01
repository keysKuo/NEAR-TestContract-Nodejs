const db = require('../../config/db');
const { data_handling } = require('../utils');
const { uuid } = require('uuidv4');

const controller = {
    find_product_by_id: async (req, res, next) => {
        const { id } = req.params;
        let sSQL = `Select * From _Product Where product_id = '${id}'`;
        return data_handling(req, res, sSQL);
    },

    find_product_many: async (req, res, next) => {
        const { type_id, product_name } = req.query;
        let sSQL = `Select * From _Product`;

        if ( type_id !== undefined && product_name !== undefined) {
            sSQL += ` Where type_id = '${type_id}' And product_name = N'${product_name}'`;
        }
        else if (type_id !== undefined) {
            sSQL += ` Where type_id = '${type_id}'`;
        }
        else if (product_name !== undefined) {
            sSQL += ` Where product_name = N'${product_name}`;
        }

        return data_handling(req, res, sSQL);

    },

    create_product: async (req, res, next) => {
        const { type_id, product_name, weight, size, price } = req.body;

        let data_set = await db.Query(`SELECT * FROM _Product Where type_id = '${type_id}' And product_name = N'${product_name}'`);
        if (data_set.length != 0) {
            return res.status(300).json({
                success: false,
                message: 'Product existed'
            })
        }

        const product_id = uuid().substring(0,8).toUpperCase();
        return await db.ExecProc({
            procedure: `PROC_INSERT_PRODUCT '${product_id}', '${type_id}', N'${product_name}', ${weight}, N'${size}', ${price}`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Product inserted successfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    update_product: async (req, res, next) => {
        const { id, type_id, product_name, weight, size, price } = req.body;
        let data_set = await db.Query(`Select * From _Product Where product_id = '${id}'`) ;
        let product = data_set[0];
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        let new_typeid = type_id || product.type_id;
        let new_productname = product_name || product.product_name;
        let new_weight = weight || product.weight;
        let new_size = size || product.size;
        let new_price = price || product.price;

        return await db.ExecProc({
            procedure: `PROC_UPDATE_PRODUCT '${id}', '${new_typeid}', N'${new_productname}', ${new_weight}, N'${new_size}', ${new_price}`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Product updated successfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            })
    },

    delete_product: async (req, res, next) => { 
        const { id } = req.params;
        
        let data_set = await db.Query(`Select * From _Product Where product_id = '${id}'`);
        if (data_set.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        return await db.ExecProc({
            procedure: `PROC_DELETE_PRODUCT '${id}'`
        })
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Product deleted successfully'
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