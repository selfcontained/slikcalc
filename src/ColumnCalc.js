/**
 * @class ColumnCalc
 * @extends BaseCalc
 * Calculator ojbect for performing column-based calculations
 */
 
/**
 * @constructor
 * @param	config[totalId]		(Required) Element ID to place end result of column calculation
 * @param	config[operator]	(Optional) Mathematical operator to apply against each column to produce end result.  Defaults to '+'
 */
slikcalc.ColumnCalc = function(config) {
	this.parent.constructor.call(this);
	this.config = config || {};
	this.operator = config.operator || '+';
	this.rows = [];
	config.registerListeners = config.registerListeners || false;
	if(config.registerListeners === true) {
		slikcalc.addOnLoad(this.registerListeners, this);
	}
	config.calcOnLoad = config.calcOnLoad || false;
	if(config.calcOnLoad === true) {
		slikcalc.addOnLoad(this.calculate, this);
	}
};
slikcalc.extend(slikcalc.ColumnCalc, slikcalc.BaseCalc);

slikcalc.ColumnCalc.prototype.config = null;
slikcalc.ColumnCalc.prototype.operator = null;
slikcalc.ColumnCalc.prototype.rows = null;

/**
 * Processes the rows and applies the 'config.operator' upon each value, placing the total in the 'config.totalId' element
 */
slikcalc.ColumnCalc.prototype.calculate = function() {
	var total = 0.00;
	for(var idx in this.rows) {
		if(this.rows.hasOwnProperty(idx)) {
			var includeRow = true;
			if(this.rows[idx].checkbox !== undefined) {
				var checkbox = this.rows[idx].checkbox;
				var checked = slikcalc.get(checkbox.id).checked;
				includeRow = (checkbox.invert !== checked);
				
				/**
				invert == false && checked == true
				invert == true && checked == false
				*/
			}
			if(includeRow === true) {
				if(this.operator === '+') {
					total = total + slikcalc.getAmount(this.rows[idx].id);
				}
			}
		}
	}
	slikcalc.setAmount(this.config.totalId, total);
	slikcalc.fireEvent(this.calculationComplete);
};

/**
 * Adds event listeners for row checkboxes and inputs
 */
slikcalc.ColumnCalc.prototype.registerListeners = function() {
	for(var idx in this.rows) {
		if(this.rows.hasOwnProperty(idx)) {
			var rowConfig = this.rows[idx];
			if(rowConfig.checkbox !== undefined) {
				slikcalc.addListener(rowConfig.checkbox.id, 'click', this.calculate, this);
			}
			slikcalc.addListener(rowConfig.id, 'keyup', this.calculateCheck, this);
		}
	}	
};

/**
 * @param	config[id]						(Required) Element id that holds the value to calculate
 * @param	config[checkbox]				(Optional) Checkbox object that defines the behavior of a checkbox
 * @param	config[checkbox][id]			(Optional) Element id of checkbox. Required if config[checkbox] included.
 * @param	config[checkbox][invert]		(Optional) true/false(default) If true, row is included in total calculcation when un-checked, and omitted when checked.
 * 
 * Adds a row config object to this.rows
 */
slikcalc.ColumnCalc.prototype.addRow = function(rowConfig) {
	rowConfig = rowConfig || {};
	if(rowConfig.checkbox !== undefined) {
		rowConfig.checkbox.invert = rowConfig.checkbox.invert || false;
	}
	this.rows.push(rowConfig);
};