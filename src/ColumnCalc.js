/**
 * @namespace slikcalc
 * @class ColumnCalc
 * @description Calculator ojbect for performing column-based calculations
 * @constructor
 * @param {object} config				(Required) Configuration object
 */
slikcalc.ColumnCalc = function(config) {
	this.parent.constructor.call(this, config);
	this.rows = [];
};
slikcalc.extend(slikcalc.ColumnCalc, slikcalc.BaseCalc);

slikcalc.ColumnCalc.prototype.rows = null;

/**
 * @description Runs on page load.  Processes calculation if calcOnLoad is set to true, and sets up event listeners 
 * if registerEventListeners is set to true.
 */
slikcalc.ColumnCalc.prototype.initialize = function() {
    if(this.calcOnLoad === true) {
        this.processCalculation();
    }
    if(this.registerListeners === true) {
		this.setupEventListeners();
	}
};

/**
 * @description Processes the rows and applies the totalOperator upon each value, placing the total in the totalId element
 */
slikcalc.ColumnCalc.prototype.calculate = function() {
	var total = null;
	for(var idx in this.rows) {
		if(this.rows.hasOwnProperty(idx)) {
			var includeRow = true;
			if(this.rows[idx].checkbox !== undefined) {
				var checkbox = this.rows[idx].checkbox;
				includeRow = (checkbox.invert !== slikcalc.get(checkbox.id).checked);
			}
			if(includeRow === true) {
				total = this.calculateTotal(total, slikcalc.getAmount(this.rows[idx].id));
			}
		}
	}
	slikcalc.setAmount(this.totalId, total);
};

/**
 * @description Adds event listeners for row checkboxes and inputs
 */
slikcalc.ColumnCalc.prototype.setupEventListeners = function() {
	for(var idx in this.rows) {
		if(this.rows.hasOwnProperty(idx)) {
			var rowConfig = this.rows[idx];
			if(rowConfig.checkbox !== undefined) {
				slikcalc.addListener(rowConfig.checkbox.id, 'click', this.processCalculation, this);
			}
			slikcalc.addListener(rowConfig.id, 'keyup', this.keyupEvent, this);
		}
	}	
};

/**
 * @description Adds a row to the calculator to be included with calculations.
 * @param {String}	config[id]						(Required) Element id that holds the value to calculate
 * @param {String}	config[checkbox][id]			(Optional) Element id of checkbox.
 * @param {boolean}	config[checkbox][invert]		(Optional) Defaults to false. If true, row is included in total calculcation when un-checked, and omitted when checked.
 */
slikcalc.ColumnCalc.prototype.addRow = function(rowConfig) {
	rowConfig = rowConfig || {};
	if(rowConfig.checkbox !== undefined) {
		rowConfig.checkbox.invert = rowConfig.checkbox.invert || false;
	}
	this.rows.push(rowConfig);
};