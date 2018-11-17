sap.ui.define([
	"lanchas/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	"sap/m/Dialog",
	'sap/m/Button',
	'sap/m/Text',
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, Controller, jQuery, JSONModel, Dialog, Button, Text, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("lanchas.controller.View1", {
		onInit: function() {

			this.getRouter().getRoute("home").attachPatternMatched(this._onRouteMatched, this);
		  },
	  
		  _onRouteMatched: function(oEvent) {
			  let data = this.getView().getModel("data")
			fetch('/factura/', {
				method: 'get',
				
				  })
				  .then(
					function(response) {
					  if (response.status !== 200) {
						console.log('Looks like there was a problem. Status Code: ' +
						  response.status);
						return;
					  }
		
					  response.json().then(function(res) {
						console.log(res);
						data.setProperty("/newFact_id", parseInt(res.data.last)+1)
						

					  });
					}
				  )
				  .catch(function(err) {
					console.log('Fetch Error :-S', err);
				  });
			this.loadDialog()
			  
		  },
		  loadDialog: function() {
			this.clientDialog = sap.ui.xmlfragment(
			  "lanchas.view.DialogCliente", this);
			this.getView().addDependent(this.clientDialog);
			this.clientDialog.open();
		  },
		  closeDialog: function() {
			console.log("Entro");
			this.clientDialog.close();
			this.clientDialog.destroy();
		  },
		  onClickAccept: function(){
			let val = this.getView().getModel("data").getProperty("/register"),
				data = this.getView().getModel("data"),
				inv = data.getProperty("/selectedKey"),
				id = data.getProperty("/id"),
				that = this,
				cliente_id = inv+id;
			console.log(cliente_id)
				console.log(val)
			if(!val){
				fetch('/cliente/', {
				headers: {
							'Content-Type': 'application/json'
						  },
				method: 'POST',
				body: JSON.stringify({
						  cliente_id : cliente_id
					  })
				  })
				  .then(
					function(response) {
					  if (response.status !== 200) {
						console.log('Looks like there was a problem. Status Code: ' +
						  response.status);
						return;
					  }
		
					  response.json().then(function(res) {
						console.log("la respuesta despues de reportes")
						console.log(res);
						data.setProperty("/records", res.data);
						data.setProperty("/register", (res.data.length==0))
						console.log(data)
						if(res.data.length>0)that.closeDialog()
					  });
					}
				  )
				  .catch(function(err) {
					console.log('Fetch Error :-S', err);
				  });
			}else{
				let nombre = data.getProperty("/name"), 
					telefono = data.getProperty("/phone"), 
					email = data.getProperty("/email"), 
					direccion = data.getProperty("/address");

				inv = data.getProperty("/selectedKey");
				id = data.getProperty("/id");
				cliente_id = inv+id;

				fetch('/cliente/addClient', {
					headers: {
								'Content-Type': 'application/json'
							  },
					method: 'POST',
					body: JSON.stringify({
							  cliente_id : cliente_id,
							  nombre: nombre, 
							  telefono: telefono, 
							  email: email, 
							  direccion: direccion
						  })
					  })
					  .then(
						function(response) {
						  if (response.status !== 200) {
							console.log('Looks like there was a problem. Status Code: ' +
							  response.status);
							return;
						  }
			
						  response.json().then(function(res) {
							console.log("la respuesta despues de reportes")
							console.log(res);
							data.setProperty("/records", res.data);
							data.setProperty("/register", (res.data.length==0))
							if(res.data.length>0) that.closeDialog()
							console.log(data)
						  });
						}
					  )
					  .catch(function(err) {
						console.log('Fetch Error :-S', err);
					  });
			}
			// this.closeDialog()
			

		  },
		  onClickAdd:function(){
			this.itemDialog = sap.ui.xmlfragment(
				"lanchas.view.DialogAddItem", this);
			  this.getView().addDependent(this.itemDialog);
			  this.itemDialog.open();
			  	
		  },
		  onClickAcceptItem:function(){
			let that = this,
				data = this.getView().getModel("data"),
				codigo = data.getProperty("/code"),
				quantity = data.getProperty("/quantity");

			console.log(codigo, quantity)
			fetch('/producto/findProductobyId', {
				headers: {
							'Content-Type': 'application/json'
						  },
				method: 'POST',
				body: JSON.stringify({
						  producto_id : codigo
					  })
				  })
				  .then(
					function(response) {
					  if (response.status !== 200) {
						console.log('Looks like there was a problem. Status Code: ' +
							response.status);
							MessageToast.show("Producto no encontrado")
						return;
					  }
		
					  response.json().then(function(res) {
						console.log(res);
						if(res.data.length >0){
							res.data[0].cantidad = quantity;
							res.data[0].monto = parseInt(quantity)*parseInt(res.data[0].precio_unitario);
							var gastos = data.getProperty("/gastos")
							gastos.push(res.data[0]);
							data.setProperty("/gastos",gastos)

							let SubT = data.getProperty("/subtotal");
							SubT = parseInt(SubT) + res.data[0].monto;
							data.setProperty("/subtotal",SubT);

							let totI = data.getProperty("/totI");
							totI = parseInt(totI) + parseInt(res.data[0].monto*(parseInt(res.data[0].impuesto)/100));
							data.setProperty("/totI",totI);

							
							let tot = parseInt(SubT) + parseInt(totI);
							data.setProperty("/total",tot);
							console.log(data)
							if(res.data.length>0){
								that.onClickCancel()
								data.setProperty("/code",""),
								data.setProperty("/quantity","");
							}
						}else{
							MessageToast.show("Producto no encontrado")
							data.setProperty("/code","")
						}
						
					  });
					}
				  )
				  .catch(function(err) {
					console.log('Fetch Error :-S', err);
				  });
			  	
		  },
		  onClickCancel:function(){
			
			this.itemDialog.close()
			this.itemDialog.destroy();
			
			  	
			},
		  onClickNo:function(){
			
			this.onCleanModels();
			this.loadDialog();
			
			  	
			},
			onSaveFactura: function (){
				let cliente_id = this.getView().getModel("data").getProperty("/records/0/cliente_id"),
						factura_id = this.getView().getModel("data").getProperty("/newFact_id"),
						gastos = this.getView().getModel("data").getProperty("/gastos"),
						cant_gastos = gastos.length, 
						subtotal = this.getView().getModel("data").getProperty("/subtotal"),
						total_impuestos = this.getView().getModel("data").getProperty("/totI"), 
						total = this.getView().getModel("data").getProperty("/total"),
						that = this;

				fetch('/factura/addFactura', {
					headers: {
								'Content-Type': 'application/json'
								},
					method: 'POST',
					body: JSON.stringify({
						factura_id: factura_id, 
						cant_gastos: cant_gastos, 
						subtotal: subtotal, 
						total_impuestos: total_impuestos , 
						total: total, 
						gastos: gastos,
						cliente_id: cliente_id
							})
						})
						.then(
						function(response) {
							if (response.status !== 200) {
							console.log('Looks like there was a problem. Status Code: ' +
								response.status);
							return;
							}
			
							response.json().then(function(res) {
								console.log(res)
								MessageToast.show("Factura guardada con éxito")
								that.onCleanModels();
								that.loadDialog()
							});
						}
						)
						.catch(function(err) {
						console.log('Fetch Error :-S', err);
						});
			},
			onCleanModels: function(){
				let data = this.getView().getModel("data")
				data.setProperty("/register",false);
				data.setProperty("/gastos",[]);
				data.setProperty("/subtotal",0);
				data.setProperty("/total",0);
				data.setProperty("/totI",0);
				data.setProperty("/newFact_id", "");
				data.setProperty("/records",[]);
				data.setProperty("/id","");
				data.setProperty("/name","");
				data.setProperty("/email","");
				data.setProperty("/phone","");
				data.setProperty("/address","");
				data.setProperty("/nfact","");
				data.setProperty("/VisFactBtn",false);

			},
			onTabSelection: function(oEvent){
				var selectedKey = oEvent.getSource().getSelectedKey();
				this.onCleanModels()
				console.log(selectedKey)
				if(selectedKey == "formFactura"){
					this.getView().getModel("data").setProperty("/VisFactBtn",true);
					this.getView().getModel("data").setProperty("/AcCltBtn",false);
				}else{
					this.getView().getModel("data").setProperty("/VisFactBtn",false);
					this.getView().getModel("data").setProperty("/AcCltBtn",true);
				}
				
			},
			onClickAnn: function(){
				let data = this.getView().getModel("data"),
						id_factura = data.getProperty("/nfact"),
						that = this;

				fetch('/factura/', {
					headers: {
								'Content-Type': 'application/json'
								},
					method: 'PUT',
					body: JSON.stringify({
						factura_id: id_factura,
						status: false
						
					})
				})
				.then(
					function(response) {
						if (response.status !== 200) {
							console.log('Looks like there was a problem. Status Code: ' +
								response.status);
								MessageToast.show("Factura no encontrada")
							return;
						}
			
						response.json().then(function(res) {
								console.log(res.data)
								let datos = res.data
								data.setProperty("/gastos",datos.gastos);
								data.setProperty("/subtotal",datos.subtotal);
								data.setProperty("/total",datos.total);
								data.setProperty("/totI",datos.total_impuestos);
								data.setProperty("/records",datos.cliente);
								data.setProperty("/newFact_id",parseInt(datos.newFact_id.last)+1);
								that.closeDialog()

						});
					})
						.catch(function(err) {
						console.log('Fetch Error :-S', err);
						
						});

			},
			handleDelete: function(oEvent){
				let sId = oEvent.getParameters().listItem.sId,
          asId = sId.split('-'),
					idx = asId[asId.length-1],
					data = this.getView().getModel("data"),
					records = data.getProperty("/gastos");
					
					records.splice(idx, 1);
					data.setProperty("/gastos",records)
					console.log(records)

			},
			onValidCi: function(o)
    {
      let input= o.getSource();
      let length = 8;
      let value = input.getValue()
      console.log("valor: " + value);
      let regex = new RegExp(`/^[0-9]{1,${length}}$/`)

      
        console.log("entro else")
        let aux = value
        .split('')
        .filter(char => {
        if (/^[0-9]$/.test(char)) 
        {
          if (char !== '.') {
            return true
          }
        }
        })
      .join('')
      value = aux.substring(0)
      input.setValue(value)

      console.log("el valor es: " + value)
      
      return false
      
    },
			onValidQuantity: function(o)
    {
      let input= o.getSource();
      let length = 8;
      let value = input.getValue()
      console.log("valor: " + value);
      let regex = new RegExp(`/^[0-9]{1,${length}}$/`)

      if (regex.test(value)) 
      {
        console.log("entro if")
        return true
      }
      else 
      {
        console.log("entro else")
        let aux = value
        .split('')
        .filter(char => {
        if (/^[0-9]$/.test(char)) 
        {
          if (char !== '.') {
            return true
          }
        }
        })
      .join('')
      value = aux.substring(0, length)
      input.setValue(value)

      console.log("el valor es: " + value)
      
      return false
      }
		},
		onClickCancelar: function(){
			this.onCleanModels();
			this.loadDialog()
		}
		
	});
});