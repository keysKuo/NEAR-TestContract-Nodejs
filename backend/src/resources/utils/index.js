const db = require('../../config/db');

module.exports.data_handling = async (req, res, sSQL, callback) => {
    await db.Query(sSQL)
        .then(data => {
            if (data.length > 0) {
                if(!callback) {
                    return res.status(200).json({
                        success: true,
                        data: data
                    })
                }
                return callback;
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

