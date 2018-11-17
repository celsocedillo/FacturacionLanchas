const express = require('express');
const config = require('../config');
const gasto = config.driver === 'postgres' ? require('../postgresql/controllers/gasto') : require('./hcp/controllers/gasto');




var api_gasto = express.Router();

api_gasto.post('/addGasto', gasto.addGasto);
api_gasto.post('/findGastoByFacturaId', gasto.findGastoByFacturaId);


module.exports = api_gasto;
