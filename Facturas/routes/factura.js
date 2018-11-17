const express = require('express');
const config = require('../config');
const factura = config.driver === 'postgres' ? require('../postgresql/controllers/factura') : require('./hcp/controllers/factura');




var api_factura = express.Router();


api_factura.post('/findFacturaById', factura.findFacturaById);
api_factura.post('/addFactura', factura.addFactura);
api_factura.put('/', factura.actualizarEstadoFactura);
api_factura.get('/', factura.findLastFacturaId);


module.exports = api_factura;
