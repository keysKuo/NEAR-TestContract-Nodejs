const db = require('../../config/db');
const { data_handling } = require('../utils');
const { uuid } = require('uuidv4');

const controller = {
    find_order_by_id: async (req, res, next) => {
        const { id } = req.params;
        let sSQL = `Select * from _Order Where order_id = '${id}'`;
        return await data_handling(req, res, sSQL);
    },

    find_order_many: async (req, res, next) => {
        let sSQL = `Select O.*, OD.product_id, OD.quantity, OD.price 
                    From _Order O , __Order_Detail OD 
                    Where O.order_id = OD.order_id`
        return await data_handling(req, res, sSQL);
    },

    create_order: async (req, res, next) => {
        const { products, sender, receiver, send_address, receive_address } = req.body;
        const order_id = 'OR' + uuid().substring(0,5).toUpperCase();
        let order_at = new Date().toISOString();
        
        var error = false;

        return await db.ExecProc({
            procedure: `PROC_INSERT_ORDER '${order_id}', N'${sender}', N'${receiver}', N'${send_address}', N'${receive_address}', '${order_at}', 'ordered'`
        })
            .then(async () => {
                for (let i = 0; i < products.length; i++) {
                    if (error) {
                        break;
                    }
                    let curr_product = await db.Query(`Select product_id from _Product Where product_id = '${products[i].product_id}'`);
                    if (curr_product.length == 0) {
                        error = true;
                        break;
                    }
                    
                    await db.ExecProc({
                        procedure: `PROC_INSERT_ORDER_DETAIL '${order_id}', '${products[i].product_id}', ${products[i].quantity}, ${products[i].price}`
                    })
                        .then(() => {
                            
                        })
                        .catch(err => {
                            error = true;
                        })
                }
                
                if (error) { 
                    return await db.ExecProc({
                        procedure: `PROC_DELETE_ORDER_DETAIL '${order_id}'`
                    })
                        .then(async () => {
                            return await db.ExecProc({
                                procedure: `PROC_DELETE_ORDER '${order_id}'`
                            })
                                .then(() => {
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Error occured while ordering'
                                    })
                                });
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success: false,
                                message: 'Error occured while deleting order and order_detail'
                            })
                        })    
                }

                return res.status(200).json({
                    success: true,
                    message: 'Order inserted successfully'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'Error occured while inserting order'
                })
            })
        
    },

    update_order: async (req, res, next) => {

    },

    delete_order: async (req, res, next) => {
        const { id } = req.params;

        let data_set = await db.Query(`Select * From _Order Where order_id = '${id}'`);
        if (data_set.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        return await db.ExecProc({
            procedure: `PROC_DELETE_ORDER_DETAIL '${id}'`
        })
            .then(async () => {
                return await db.ExecProc({
                    procedure: `PROC_DELETE_ORDER '${id}'`
                })
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: 'Order deleted successfully'
                        })
                    });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    error: err,
                    message: 'Error occured while deleting order and order_detail'
                })
            })   
    }
}



module.exports = controller;