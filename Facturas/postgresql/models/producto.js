const config = require('../../config');
const conn = require('../db');

exports.findProductobyId = function(producto_id) {
    return conn.db.any(`SELECT *
                        FROM public.producto WHERE producto_id = $1;`, [producto_id]);
};

