// const config = require('../../config');
const DBlayer = require('../models/factura');
const DBgasto = require('../models/gasto');
const DBcliente = require('../models/cliente');
//var prueba = require('../Apps/userControl/webapp/controller/App.controller.js')
// passport = require('../../passport.js');




exports.findLastFacturaId = function (req, res) {
    DBlayer.findLastFacturaId(req.body.factura_id)
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
exports.findFacturaById = async function (req, res) {

    try{
        console.log("my req ", req.body)
        let f = await DBlayer.findFacturaById(req.body.factura_id)
console.log("my facutra ",f)
        f.gastos = await DBgasto.findGastoByFacturaId(req.body.factura_id);
        f.cliente = await DBcliente.findClientById(f.cliente_id)

        res.status(200).json({
            statusCode: 200,
            data: f
        });
    }
    catch(err) {
        res.status(500).send(err);
    }

}
exports.addFactura = async function (req, res) {

    try{
        console.log(req.body)
        let gastos = req.body.gastos,
            If = await DBlayer.addFactura(req.body.factura_id, req.body.cant_gastos, req.body.subtotal, req.body.total_impuestos, req.body.total, req.body.cliente_id);
        console.log(If)
            gastos.forEach(async element => {
            var g = await DBgasto.addGasto(element.producto_id, element.cantidad, element.monto, req.body.factura_id)
        });
        res.status(200).json({
            statusCode: 200
        });
    }catch (err) {
        res.status(500).json({
        statusCode: 500,
        pgErrorCode: err
        });
    }

}

exports.actualizarEstadoFactura = async function (req, res) {
    try{
        console.log("my req ", req.body)
        let f = await DBlayer.findFacturaById(req.body.factura_id)
        console.log("my facutra ",f)
        f.gastos = await DBgasto.findGastoByFacturaId(req.body.factura_id);
        f.cliente = await DBcliente.findClientById(f.cliente_id)
        let l = await DBlayer.actualizarEstadoFactura(req.body.factura_id, req.body.status);
            f.newFact_id = await DBlayer.findLastFacturaId();
        res.status(200).json({
            statusCode: 200,
            data: f
        });
    }
    catch(err) {
        res.status(500).send(err);
    }
}



















// exports.inicioPassport = function (req, res, next) {
//     passport.authenticate('local', function (err, user, info) {

//         if (err) {           
//             return res.status(309).send({
//                 title: 'err'
//             });
//         }
//         if (!user) {
//             return res.status(311).send({
//                 title: 'userControl'
//             });
//         };
//         return req.logIn(user, function (err) {
//             if (err) {
//                 return res.status(309).send({
//                     title: 'userControl'
//                 });
//             } else {
//                 // console.log("LLegamos a passportinicial - principal");
//                 if (!req.isAuthenticated()) {
//                     res.redirect('/userControl/signin');
//                 } else {
//                     var user = req.user;
//                     // console.log(user);
//                     return res.status(301).send({
//                         title: 'launchpad',
//                         user: user
//                     });
//                 }
//             }
//         });
//     })(req, res, next);
//     // DBlayer.DBfindUser(req.body.username)
//     // .then(function (data) {
//     //     res.status(200).json({
//     //         statusCode: 200,
//     //        
//     //     });
//     // })
//     // .catch(function (err) {
//     //     res.status(500).send(err);
//     // });
// };

// exports.passportinicial = function (req, res, next) {
//     // If user is not authenticated, redirect them
//     // to the signin page.
//     if (!req.isAuthenticated()) {
//         res.redirect('/userControl/signin');
//     } else {
//         var user = req.user;
//         return res.status(301).send({
//             title: 'launchpad',
//             user: user
//         });
//     }
// }

// exports.signin = function (req, res, next) {
//      if (req.isAuthenticated()) {
//         res.redirect('/userControl/passportInicial');
//     } else {
//         // console.log('No session');
//         return res.status(309).send({
//             title: 'userControl'
//         });
//     }
// }

// exports.signout = function (req, res, next) {
//     if (!req.isAuthenticated()) {
//         return res.redirect('/userControl/signin');
//     } else {
//         req.logOut();
//         cookie = req.cookies;
//         console.log(cookie);
//         req.session.destroy(function (err) {
//             return res.status(310).send({
//                 title: 'signout'
//             });
//             // return res.redirect('/userControl/signin');
//         });
//     }
// }

// exports.PassportWithAppValidation = function (req, res, next) {
// //  console.log('PassportWithAppValidation');
 
//     if (req.isAuthenticated()) {
//         DBlayerApp.DBfindAppRolEspecial(req.user[0]["rol_id"] , req.body.Appname)
//         .then(function (data){
//             return res.status(200).send(data);
//         });

//     } else {
//         return res.status(309).send({
//             title: 'userControl'
//         });
//     }
// }


// exports.LogIn = function (req, res, next) {
//      //console.log(req);
//      if (req.isAuthenticated()) {
//         return res.status(301).send({
//             title: 'launchpad',
//             user: req.user
//         });
//     } else {
//         return res.status(309).send({
//             title: 'userControl'
//         });
//     }
// }

// // exports.login = function (req, res) {


// //     console.log(req.body.user_id);

// //     console.log(req.body.password);

// //     DBlayer.DBlogin(req.body.user_id)
// //         .then(function (data) {
// //             bcrypt.compare(req.body.password, data[0]["password"])
// //                 .then(function (red) {
// //                     if (!red) {

// //                         res.status(403).send(red);
// //                     } else {
// //                         res.status(200).send(red);
// //                     }

// //                 });


// //         })
// //         .catch(function (err) {
// //             res.status(500).send(err);
// //         });
// // };

// exports.editUserAct = function (req, res) {
//     DBlayer.DBeditUserAct(req.body.user_id, req.body.active)
//         .then(function (data) {
//             res.status(200).json({
//                 statusCode: 200,
//                 data: data
//             });
//         })
//         .catch(function (err) {
//             res.status(500).send(err);
//         });
// };

// // exports.addUser = function (req, res) {
// //     DBlayer.DBaddUser(req.body.username, req.body.password, req.body.type_user)
// //         .then(function (data) {
// //             res.status(200).json({
// //                 statusCode: 200,
// //                 data: data
// //             });
// //         })
// //         .catch(function (err) {
// //             res.status(500).send(err);
// //         });
// // };

// // exports.updateUserPermissions = function (req, res) {
// //     DBlayer.DBupdateUserPermissions(req.body.user, req.body.technicalConfiguration, req.body.scenarymainteinance, req.body.liftBreeding, req.body.breedingplanningm, req.body.anualposturecurve, req.body.incubatorplanningm, req.body.broilerplanningm, req.body.broilereviction)
// //         .then(function (data) {
// //             res.status(200).json({
// //                 statusCode: 200,
// //                 data: data
// //             });
// //         })
// //         .catch(function (err) {
// //             res.status(500).send(err);
// //         });
// // };

// exports.updateUserPassword = function (req, res) {
//     bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
//         .then(function (hashedPassword) {
//             DBlayer.DBupdateUserPassword(req.body.user_id, hashedPassword)
//                 .then(function (data) {
//                     res.status(200).json({
//                         statusCode: 200,
//                         data: data
//                     });
//                 })
//                 .catch(function (err) {
//                     res.status(500).send(err);
//                 });
//         })

// };

// // exports.deleteUser = function (req, res) {
// //     DBlayer.DBdeleteUser(req.body.user)
// //         .then(function (data) {
// //             res.status(200).json({
// //                 statusCode: 200,
// //                 mgs: "Usuario " + req.body.user + " Eliminado"
// //             });
// //         })
// //         .catch(function (err) {
// //             res.status(500).send(err);
// //         });
// // };