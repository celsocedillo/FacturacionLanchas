const express = require('express');
const config = require('../config');
const cliente = config.driver === 'postgres' ? require('../postgresql/controllers/cliente') : require('./hcp/controllers/clente');



var api_clients = express.Router();

api_clients.post('/', cliente.findClientById);
api_clients.post('/addClient', cliente.addClient);
api_clients.post('/deleteClient', cliente.deleteClient);



module.exports = api_clients;
