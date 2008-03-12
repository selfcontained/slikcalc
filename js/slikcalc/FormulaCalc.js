/**
 * @class FormulaCalc
 * @extends BaseCalc
 * Class that calculates the total across multiple rows and updates a single totals value.
 * Calculations are done based on a given formula, and mapped variables.
 */
 
/**
 * @constructor
 * @param	config[total][id]		Element id of where the total value is placed
 * @param	config[total][operator]	Mathematical operator to be applied to each row value, defaults to '+'
 * @param	config[formula]			Mathematical formula in string form.  Variables denoted within the '{}' that map to vars definitions
 *  								passed in on the addRow method.  Example: "{a} + {b} = {c}".  "{a} + {b}" is used as the formula, 
 * 									and {c} becomes the position that the eval'd result is placed into.
 */
FormulaCalc = function(config) {
	FormulaCalc.superclass.constructor.call(this); 
	config = config || {};
	this.calcOnLoad = config.calcOnLoad || false;
	this.formula = config.formula || '';
    config.total = config.total || {};
	this.totalId = config.total.id || null;
	this.totalOperator = config.total.operator || '+';
	this.rows = [];
	this.variables = [];
    this.registerListeners = config.registerListeners || false;
	YAHOO.util.Event.addListener(window, 'load', this.initialize, this, true);
	if(config.vars !== undefined) {
		this.addRow({ vars : config.vars });
	}
};
YAHOO.lang.extend(FormulaCalc, BaseCalc);

/**
 * @prototype
 */
FormulaCalc.prototype.calcOnLoad = false;
FormulaCalc.prototype.registerListeners = false;
FormulaCalc.prototype.initialized = false;
FormulaCalc.prototype.totalId = null;
FormulaCalc.prototype.totalOperator = null;
FormulaCalc.prototype.formula = null;
FormulaCalc.prototype.formulaParsed = null;
FormulaCalc.prototype.resultVar = null;
FormulaCalc.prototype.varMatch = /\{(\w)\}/gi;
FormulaCalc.prototype.rows = null;

FormulaCalc.prototype.initialize = function() {
	this.initialized = true;
	this.formulaParsed = this.formula;
	if(this.formulaParsed.indexOf('=') !== -1) {
		var formulaSplit = this.formulaParsed.split('=');
		this.formulaParsed = formulaSplit[0];
		this.resultVar = this.varMatch.exec(YAHOO.lang.trim(formulaSplit[1]))[1];
	}
	this.varMatch.lastIndex = 0;
	while((result = this.varMatch.exec(this.formulaParsed)) !== null) {
		this.variables.push(result[1]);
	}
	this.varMatch.lastIndex = 0;
	if(this.calcOnLoad === true) {
		this.calculate();
	}
};

/**
 * @param	vars							Array of variable definitions used in the formula
 * @param 	vars[x][id]						Element id for variable 'x' in formula
 * @param	vars[x][defaultValue]			Value used in place of empty/null for variable 'x'
 * @param	config[checkbox]				(Optional) Checkbox object that defines the behavior of a checkbox
 * @param	config[checkbox][id]			(Optional) Element id of checkbox. Required if config[checkbox] included.
 * @param	config[checkbox][checkedIsOn]	(Optional) (default)true/false If true, row is only calculated if checkbo
 * 
 * Adds a rowConfig object to this.rows
 */
FormulaCalc.prototype.addRow = function(rowConfig) {
	rowConfig = rowConfig || {};
	if(rowConfig.checkbox !== undefined) {
		YAHOO.util.Event.addListener(rowConfig.checkbox.id, 'click', this.calculate, this, true);
		rowConfig.checkbox.checkedIsOn = rowConfig.checkbox.checkedIsOn || true;
	}
	for(var idx in rowConfig.vars) {
		var variable = rowConfig.vars[idx];
		variable.defaultValue = variable.defaultValue || 0;
        rowConfig.registerListeners = rowConfig.registerListeners === true || (this.registerListeners === true && rowConfig.registerListeners !== false);
		if(rowConfig.registerListeners === true) {
			YAHOO.util.Event.addListener(variable.id, 'keypress', this.calculateCheck, this, true);
		}
	}
	this.rows.push(rowConfig);
};

FormulaCalc.prototype.calculate = function() {
	if(this.initialized === false) {
		this.initialize();
	}
	var total = 0.00;
	for(var idx in this.rows) {
		var includeRow = true;
		if(this.rows[idx].checkbox !== undefined) {
			var checkbox = this.rows[idx].checkbox;
			includeRow = (checkbox.checkedIsOn === YAHOO.util.Dom.get(checkbox.id).checked);
		}
		var rowTotal = 0;

		var formulaString = this.formulaParsed;
		for(var varIdx in this.variables) {
			var variableName = this.variables[varIdx];
			var variable = this.rows[idx].vars[variableName];
			var value = variable.defaultValue;
			if(YAHOO.util.Dom.get(variable.id) !== null) {
				value = slikcalc.getValue(variable.id);
				value = value === '' ? variable.defaultValue : value;
				value = slikcalc.formatCurrency(value);
			}
			var variableRegex = new RegExp("\\{" + variableName + "\\}");
			formulaString = formulaString.replace(variableRegex, value);
		}
		rowTotal = slikcalc.formatCurrency(eval(formulaString));
		if(this.resultVar !== null) {
			var resultId = this.rows[idx].vars[this.resultVar].id;
			var currentAmount = slikcalc.getValue(resultId);
			if(currentAmount != rowTotal) {
				slikcalc.setAmount(resultId, rowTotal);
			}
		}
		if(includeRow === true) {
			if(this.totalOperator !== null) {
				if(this.totalOperator === '+') {
					total = total + parseFloat(rowTotal);
				}
			}
		}
	}
	if(this.totalId !== null) {
		slikcalc.setAmount(this.totalId, total);
	}
	this.calculationComplete.fire();
};