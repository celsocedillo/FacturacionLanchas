const DBlayer = require('../models/cliente');

exports.findClientById = async function (req, res) {
    
    DBlayer.findClientById(req.body.cliente_id)
    .then(function(data) {
        res.status(200).json({
            statusCode: 200,
            data: data
        });
    })
    .catch(function(err) {
        res.status(500).send(err);
    });
    
}
exports.addClient = async function (req, res) {
//  console.log('PassportWithAppValidation');
        let add = DBlayer.addClient(req.body.cliente_id, req.body.nombre, req.body.telefono, req.body.email, req.body.direccion)
        DBlayer.findClientById(req.body.cliente_id)
        .then(function(data) {
                res.status(200).json({
                    statusCode: 200,
                    data: data
                });
            })
            .catch(function(err) {
                res.status(500).send(err);
        });
    
}
exports.deleteClient = function (req, res) {
 
}
