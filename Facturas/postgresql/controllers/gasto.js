// const config = require('../../config');
const DBlayer = require('../models/factura');
//var prueba = require('../Apps/userControl/webapp/controller/App.controller.js')
// passport = require('../../passport.js');




exports.addGasto = function (req, res) {
 
    DBlayer.addGasto(req.body.producto_id, req.body.cant_producto, req.body.total_gasto, req.body.factura_id)
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

exports.findGastoByFacturaId = function (req, res) {

    DBlayer.findGastoByFacturaId(req.body.factura_id)
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
