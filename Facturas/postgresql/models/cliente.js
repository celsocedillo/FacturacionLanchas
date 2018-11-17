const config = require('../../config');
const conn = require('../db');

exports.findClientById = function(cliente_id) {
    return conn.db.any(`SELECT *
                        FROM public.cliente WHERE cliente_id = $1;`, [cliente_id]);
};

exports.addClient = function(cliente_id, nombre, telefono, email, direccion) {
    return conn.db.any(`INSERT INTO public.cliente(
      cliente_id, nombre, telefono, email, direccion)
      VALUES ($1, $2, $3, $4, $5);`, [cliente_id, nombre, telefono, email, direccion]);
};

