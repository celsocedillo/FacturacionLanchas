const config = require('../../config');
const conn = require('../db');

exports.addGasto = function(producto_id, cant_producto, total_gasto, factura_id) {
  console.log("un gsato ",producto_id, cant_producto, total_gasto, factura_id)
    return conn.db.none(`INSERT INTO public.gasto(
      producto_id, cant_producto, total_gasto, factura_id)
      VALUES ($1, $2, $3, $4);`, [producto_id, cant_producto, total_gasto, factura_id]);
};


exports.findGastoByFacturaId = function(factura_id) {
    return conn.db.any(`SELECT gasto_id, b.producto_id, cant_producto as cantidad, total_gasto as monto, factura_id, b.concepto
    FROM public.gasto a
    LEFT JOIN producto b on b.producto_id = a.producto_id WHERE a.factura_id = $1;`, [factura_id]);
};


exports.DBfindHousingWayDetByHwdId = function(housing_way_id) {
    return conn.db.any(`SELECT housingway_detail_id, housing_way_id, TO_CHAR(scheduled_date, 'DD/MM/YYYY') as scheduled_date, 
                        executionfarm_id as executedfarm_id, z.name as excecutedfarm, executioncenter_id as executedcenter_id, w.name as excecutedcenter, executionshed_id as executedshed_id, v.code as executedshed, 	
                        scheduled_quantity, a.farm_id, a.shed_id, a.center_id, e.name as center_name, b.code, (b.stall_height * b.stall_width * b.capacity_max) as capmax,confirm, TO_CHAR(execution_date, 'DD/MM/YYYY') as execution_date, 
                        execution_quantity, case when execution_date is null then true else false end as available, c.name, 
                        'None' as state_date, '' as state_text_date, 'None' as state_quantity, '' as state_text_quantity, lot, d.name as incubatorname, d.incubator_plant_id 
                        FROM public.txhousingway_detail a 
                        LEFT JOIN public.osshed b on a.shed_id = b.shed_id 
                        LEFT JOIN public.osshed v on a.executionshed_id = v.shed_id
                        LEFT JOIN public.osfarm c on a.farm_id = c.farm_id 
                        LEFT JOIN public.osfarm z on a.executionfarm_id = z.farm_id
                        LEFT JOIN oscenter e on a.center_id = e.center_id
                        LEFT JOIN public.oscenter w on a.executioncenter_id = w.center_id
                        LEFT JOIN public.osincubatorplant d on a.incubator_plant_id=d.incubator_plant_id 
                        WHERE housingway_detail_id = $1 order by scheduled_date DESC`, [housing_way_id]);
};


exports.DBaddHousingWayDetail = function(housing_way_id, scheduled_date, scheduled_quantity,
                                         farm_id, shed_id, center_id, confirm, incubator_plant_id) {
console.log(housing_way_id+ " "+scheduled_date+" "+scheduled_quantity+" "+farm_id+ " "+shed_id+ " "+center_id+ " "+confirm+" "+ incubator_plant_id)
  return conn.db.one('INSERT INTO public.txhousingway_detail (housing_way_id, scheduled_date, '+
                      'scheduled_quantity, farm_id, shed_id, center_id, confirm, incubator_plant_id) '+
                      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING housingway_detail_id ',
                      [housing_way_id, scheduled_date, scheduled_quantity, farm_id,
                      shed_id, center_id, confirm, incubator_plant_id]);

};

exports.DBupdateLot = function(lot, housingway_detail_id) {
  // console.log("lot: ", lot);
  let promise = conn.db.none('UPDATE public.txhousingway_detail SET lot = $1 '+
                             'WHERE housingway_detail_id = $2 ',
                             [lot, housingway_detail_id ]);
  return promise;
};

exports.DBfindPredecessor = function(housingway_id) {
  // console.log("DBfindPredecessor: ", housingway_id);
  let promise = conn.db.any('SELECT predecessor_id '+
                             'FROM public.txhousingway '+
                             'WHERE housing_way_id = $1 ',
                             [housingway_id ]);
  return promise;
};

exports.DBfindLot = function(housingway_id) {
  // console.log("DBfindLot: ", housingway_id);
  let promise = conn.db.any('SELECT lot '+
                             'FROM public.txhousingway_detail '+
                             'WHERE housingway_detail_id = $1 ',
                             [housingway_id ]);

  return promise;
};

exports.DBupdateHousingWayDetail = function(execution_date, execution_quantity,housingway_detail_id, executionfarm_id, executioncenter_id, executionshed_id) {
  console.log("lo que esta llegando hoy")
  console.log(execution_date, execution_quantity,housingway_detail_id);
  let promise = conn.db.none('UPDATE public.txhousingway_detail SET execution_date = $1, '+
                             'execution_quantity = $2, executionfarm_id = $4, executioncenter_id = $5, executionshed_id = $6 WHERE housingway_detail_id = $3',
                             [execution_date, execution_quantity, housingway_detail_id, executionfarm_id, executioncenter_id, executionshed_id]);

  return promise;
};

exports.DBfindHousingWayDetailById = function(housingway_detail_id) {
  //console.log("DBfindLot: ", housingway_id);
  let promise = conn.db.any('SELECT * '+
                             'FROM public.txhousingway_detail '+
                             'WHERE housingway_detail_id = $1 ',
                             [housingway_detail_id ]);

  return promise;
};

exports.DBdeleteHousingWayDetail = function(housingway_detail_id) {

    return conn.db.none("DELETE FROM public.txhousingway_detail WHERE housingway_detail_id = $1 and confirm = '0' ",[housingway_detail_id]);
};

exports.DBfindHousingWayDetailConfirm = function(housing_way_id, confirm=1) {

  let promise = conn.db.any('SELECT * '+
                             'FROM public.txhousingway_detail '+
                             'WHERE housing_way_id = $1 and confirm = $2 ',
                             [housing_way_id, confirm ]);

  return promise;
};

exports.DBHousingWayDetailVerify = function(housingway_detail_id) {

  let promise = conn.db.any('SELECT * '+
                             'FROM public.txhousingway_detail '+
                             'WHERE housingway_detail_id = $1 and confirm = 0 ',
                             [housingway_detail_id ]);

  return promise;
};

exports.DBfindAllDateQuantityFarmProduct = function() {

    // return conn.db.any("SELECT '1' as POS, a.housingway_detail_id, a.housing_way_id as ID, TO_CHAR(scheduled_date, 'DD.MM.YYYY') as SCHEDULED_DATE, "+
    // "scheduled_quantity as SCHEDULED_QUANTITY, c.code as CENTER_CODE , g.code as PRODUCT_CODE "+
    // "FROM public.txhousingway_detail a "+
    // "LEFT JOIN public.osshed b on a.shed_id = b.shed_id "+
    // "LEFT JOIN public.osfarm c on a.farm_id = c.farm_id "+
    // "LEFT JOIN public.osincubatorplant d on a.incubator_plant_id = d.incubator_plant_id "+
    // "LEFT JOIN public.txhousingway e on a.housing_way_id = e.housing_way_id "+
    // "LEFT JOIN public.mdprocess f on e.stage_id = f.stage_id "+
    // "AND e.breed_id = f.breed_id "+
    // "LEFT JOIN public.mdproduct g on f.product_id = g.product_id "+
    // "WHERE a.incubator_plant_id = 0");


    // LISTO
    return conn.db.any(`SELECT '1' as POS, TO_CHAR(scheduled_date+f.historical_duration, 'DD.MM.YYYY') as SCHEDULED_DATE, 
            sum(scheduled_quantity) as SCHEDULED_QUANTITY, c.code as CENTER_CODE , '140002' PRODUCT_CODE 
            FROM public.txhousingway_detail a 
            LEFT JOIN public.txhousingway e on a.housing_way_id = e.housing_way_id 
            LEFT JOIN public.osfarm c on a.farm_id = c.farm_id 
            LEFT JOIN public.mdprocess f on e.stage_id = f.stage_id AND e.breed_id = f.breed_id 
            WHERE a.incubator_plant_id = 0
            group by(a.scheduled_date+f.historical_duration, c.code)`);




};

exports.DBfindAllDateQuantityFarmProductReproductora = function() {
    // OLD
    // return conn.db.any("SELECT '4' as POS, a.housing_way_id as ID, TO_CHAR(scheduled_date, 'DD.MM.YYYY') as SCHEDULED_DATE, "+
    //     "scheduled_quantity as SCHEDULED_QUANTITY, c.code as CENTER_CODE , g.code as PRODUCT_CODE "+
    //     "FROM public.txhousingway_detail a "+
    //     "LEFT JOIN public.osshed b on a.shed_id = b.shed_id "+
    //     "LEFT JOIN public.osfarm c on a.farm_id = c.farm_id "+
    //     "LEFT JOIN public.osincubatorplant d on a.incubator_plant_id = d.incubator_plant_id "+
    //     "LEFT JOIN public.txhousingway e on a.housing_way_id = e.housing_way_id "+
    //     "LEFT JOIN public.mdprocess f on e.stage_id = f.stage_id "+
    //     "AND e.breed_id = f.breed_id "+
    //     "LEFT JOIN public.mdproduct g on f.product_id = g.product_id "+
    //     "WHERE a.incubator_plant_id !=0");

console.log("llego al modelo de back")
    // LISTO
    return conn.db.any(`SELECT '4' as POS, TO_CHAR(e.projected_date + 280, 'DD.MM.YYYY') as SCHEDULED_DATE, 
            ROUND (SUM(e.projected_quantity) * 
      (
        SELECT SUM(theorical_performance) FROM public.txposturecurve WHERE breed_id = e.breed_id
      ))
      as SCHEDULED_QUANTITY, e.breed_id, 
            c.code as CENTER_CODE , '170000' PRODUCT_CODE
            FROM public.txhousingway e
            LEFT JOIN public.txhousingway_detail a on e.housing_way_id = a.housing_way_id
            LEFT JOIN public.osfarm c on a.farm_id = c.farm_id 
            WHERE e.predecessor_id != 0 and e.housing_way_id = a.housing_way_id
            GROUP BY(e.projected_date, c.code, e.breed_id)`);
};  


exports.DBgetPredecesorShed= function(id){
  return conn.db.any('select a.shed_id '+
        'from public.txhousingway_detail a '+
        'where a.housingway_detail_id= ( select h.predecessor_id '+
                                        'from public.txhousingway_detail d, public.txhousingway h '+
                                        'where d.housingway_detail_id= $1 '+
                                        'and d.housing_way_id= h.housing_way_id) ', [id]);
}