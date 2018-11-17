const express = require('express');
const config = require('../config');
const producto = config.driver === 'postgres' ? require('../postgresql/controllers/producto') : require('./hcp/controllers/producto');




var api_producto = express.Router();

api_producto.post('/findProductobyId', producto.findProductobyId);


//api_producto.post('/', producto.addUser);
// api_producto.put('/', producto.updateUserPermissions);

// api_producto.post('/login', producto.login);
// api_producto.delete('/', producto.deleteUser);

module.exports = api_producto;
