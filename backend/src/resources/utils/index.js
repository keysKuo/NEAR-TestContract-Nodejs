const db = require('../../config/db');

module.exports.data_handling = async (req, res, sSQL) => {
    await db.Query(sSQL)
        .then(data => {
            if (data.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: data
                })
            }
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            })
        })       
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err
            })
        })
}