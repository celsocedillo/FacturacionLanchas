const express = require('express');
const bodyParser = require('body-parser');
const fs =  require('fs');
const app = express();
const config = require('./config');
const helmet = require('helmet');


//Alex Prueba --------------------------------------------------------------------
var 
    path          = require('path'),
	session       = require('express-session'),
	cookieParser  = require('cookie-parser'),
	logger 		  = require('morgan'),
	cors		  = require('cors');
    PORT          = process.env.PORT || config.port;

//--------------------------------------------------------------------

const api_cliente = require('./routes/cliente');
const api_factura = require('./routes/factura');
const api_gasto = require('./routes/gasto');
const api_producto = require('./routes/producto');

// Evitar problemas de CORS:
app.use(function(req, res, next) {

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

const appLanchas = '/ARP_FRONTEND/lanchas/webapp';

const appLaunchpad = '/ARP_FRONTEND/launchpad/webapp';
const appCalendar = '/ARP_FRONTEND/my-calendar/webapp/';
const appConfiguration = __dirname + '/ARP_FRONTEND/technicalConfiguration/webapp';
const appManagement = __dirname + '/ARP_FRONTEND/mantenimiento-escenarios/webapp';

const appUsers = '/ARP_FRONTEND/userControl/webapp';

// console.log(appLaunchpad);
console.log("http://localhost:3009/Apps/launchpad/webapp/");




// app.use(logger('dev'));

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 1000000,
  extended: false
}));



app.use(express.static(path.join(__dirname)));

app.use(helmet())

//--------------------------------------------------------------------------------

app.use('/launchpad', express.static(appLaunchpad));
app.use('/lachas', express.static(appLanchas));
app.use('/userControl', express.static(appUsers));
app.use('/app1', express.static(appCalendar));
app.use('/app2', express.static(appConfiguration));
app.use('/app3', express.static(appManagement));

// app.use('/userControl', express.static(appUsers));

app.use('/cliente', api_cliente);
app.use('/factura', api_factura);
app.use('/gasto', api_gasto);
app.use('/producto', api_producto);






// app.use('/calendar', api_calendar);

// app.use('/calendarDay', api_calendar_day);
// //app.use('/escenario', api_escenario);
// app.use('/process', api_procesos);
// app.use('/holiday', api_holiday);
// app.use('/scenario', api_scenario);
// app.use('/scenario_param',api_scenarioP);
// app.use('/scenario_proc', api_scenarioProc);
// app.use('/parameter',api_parameter);
// app.use('/stage',api_stage);
// app.use('/product',api_product);
// app.use('/measure',api_measure);
// app.use('/scenario_form',api_scenarioF);
// app.use('/breed',api_breed);
// app.use('/partnership', api_partnership);
// app.use('/farm',api_farm);
// app.use('/center',api_center);
// app.use('/warehouse',api_warehouse);
// app.use('/shed',api_shed);
// app.use('/silo',api_silo);
// app.use('/farm_type',api_farmType);
// app.use('/housingway',api_housingWay);
// app.use('/housingwaydetail',api_housingWayD);
// app.use('/lot',api_lot);
// app.use('/downloadFile', api_fileExport);
// app.use('/av_shed', api_availabilityShed);
// app.use('/shed_status', api_shedStatus);
// app.use('/posture_curve', api_postureCurve);
// app.use('/lot_eggs', api_lotEggs);
// app.use('/lift_breeding', api_liftBreeding);
// app.use('/sposture_curve', api_scenario_posture_curve);
// app.use('/brooder_machine', api_brooder_machine);
// app.use('/incubator_plant', api_incPlant);
// app.use('/incubator', api_incubator);
// app.use('/eggs_storage', api_eggsStorage);
// app.use('/programmed_eggs', api_programmed_eggs);
// app.use('/broiler', api_broiler);
// app.use('/broilerdetail', api_broiler_detail);
// app.use('/broilerEviction', api_broilereviction);
// app.use('/broilerEvictionDetail', api_broilereviction_detail);
// app.use('/broiler_product', api_broiler_product);
// app.use('/slaughterhouse', api_slaughterhouse);
// app.use('/synchronization', api_synchronization);
// app.use('/dailyMonitor', api_dailyMonitor);

// app.use('/userControl',api_users);
// app.use('/appControl',api_apps);
// app.use('/user_appControl',api_userapps);
// app.use('/userManagement',api_userM);
// // app.use('/hen', api_scenario_hen);
// app.use('/reports', api_reports);
// app.use('/app_rolControl',api_app_RolControl);
// app.use('/dataImport',api_app_dataImport);


// //ABA
// app.use('/abaElements', apiAbaElements);
// app.use('/abaElementsProperties', apiAbaElementsProperties);
// app.use('/abaFormulation', apiAbaFormulation);
// app.use('/abaTimeUnit', apiAbaTimeUnit);
// app.use('/abaConsumptionAndMortality', apiAbaConsumptionAndMortality);
// app.use('/abaElementsAndConcentrations', apiAbaElementsAndConcentrations);
// app.use('/abaResults', apiAbaResults);
// app.use('/abaBreedsAndStages', apiAbaBreedsAndStages);
// app.use('/abaConsumptionAndMortalityDetail', apiAbaConsumptionAndMortalityDetail);
// app.use('/abaStagesOfBreedsAndStages', apiAbaStagesOfBreedsAndStages);
// app.use('/abaAlimentsAndStages', apiAbaAlimentsAndStages);
// app.use('/abaResultsGeneration', apiAbaResultsGeneration);

module.exports = app;
