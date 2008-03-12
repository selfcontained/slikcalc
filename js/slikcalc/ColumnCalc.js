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
ColumnCalc = function(config) {
	ColumnCalc.superclass.constructor.call(this); 
	this.config = config || {};
	this.operator = config.operator || '+';
	this.rows = [];
	config.registerListeners = config.registerListeners || false;
	if(config.registerListeners === true) {
		YAHOO.util.Event.addListener(window, 'load', this.registerListeners, this, true);
	}
	config.calcOnLoad = config.calcOnLoad || false;
	if(config.calcOnLoad === true) {
		YAHOO.util.Event.addListener(window, 'load', this.calculate, this, true);
	}
};
YAHOO.lang.extend(ColumnCalc, BaseCalc);

/**
 * @prototype
 */
ColumnCalc.prototype.config = null;
ColumnCalc.prototype.operator = null;
ColumnCalc.prototype.rows = null;

ColumnCalc.prototype.calculate = function() {
	var total = 0.00;
	for(var idx in this.rows) {
		
		var includeRow = true;
		if(this.rows[idx].checkbox !== undefined) {
			var checkbox = this.rows[idx].checkbox;
			var checked = YAHOO.util.Dom.get(checkbox.id).checked;
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
	slikcalc.setAmount(this.config.totalId, total);
	this.calculationComplete.fire();
};

ColumnCalc.prototype.registerListeners = function() {
	for(var idx in this.rows) {
		YAHOO.util.Event.addListener(this.rows[idx].id, 'keyup', this.calculateCheck, this, true);
	}	
};

/**
 * @param	config[id]						(Required) Element id that holds the value to calculate
 * @param	config[checkbox]				(Optional) Checkbox object that defines the behavior of a checkbox
 * @param	config[checkbox][id]			(Optional) Element id of checkbox. Required if config[checkbox] included.
 * @param	config[checkbox][invert]	(Optional) (default)true/false If true, row is only calculated if checkbox is checked
 * 
 * Adds a row config object to this.rows
 */
ColumnCalc.prototype.addRow = function(rowConfig) {
	rowConfig = rowConfig || {};
	if(rowConfig.checkbox !== undefined) {
		YAHOO.util.Event.addListener(rowConfig.checkbox.id, 'click', this.calculate, this, true);
		rowConfig.checkbox.invert = rowConfig.checkbox.invert || false;
	}
	this.rows.push(rowConfig);
};