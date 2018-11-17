sap.ui.define([
	"lanchas/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	'sap/m/Button',
	'sap/m/Text',
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller'
], function(BaseController, JSONModel, Dialog, Button, Text, jQuery, Controller) {
	"use strict";

	return BaseController.extend("lanchas.controller.App", {

		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}

	});
});
