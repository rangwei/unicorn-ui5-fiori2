sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/f/library"
], function (Controller, JSONModel, fioriLibrary) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.Detail", {
		onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
			
			var oFundingModel = new JSONModel();
			var oFModel = new JSONModel({
				name: "This is investor page"
			});
			
			oOwnerComponent.setModel(oFModel, "funding");
			
			this.getView().setModel(oFundingModel, "fundings");
		},
		
		onPress: function (oEvent) {
			var uuid = oEvent.getSource().getBindingContext("fundings").getProperty("uuid");
				// supplier = supplierPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detailDetail", {layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded, uuid: uuid, product: this._product});
		},

		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			
			var oFundingModel =  this.getView().getModel("fundings");

			
			var url = '/WINT2/unicorns/' + this._product;
      
			$.ajax({
				url: url,
				type: "GET",
				contentType: "application/json",
				dataType: 'json',
				success: function(data, textStatus, jqXHR) {
					oFundingModel.setData(data);
					
				}
			});
			// this.getView().bindElement({
			// 	path: "/unicorns/" + this._product,
			// 	model: "products"
			// });
		},
		
		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});