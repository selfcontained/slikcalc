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
slikcalc.FormulaCalc = function(config) {
	this.parent.constructor.call(this, config);
	config = config || {};
	this.formula = config.formula || '';
	this.rows = [];
	this.variables = [];
	if(config.vars !== undefined) {
		this.addRow({ vars : config.vars });
	}
};
slikcalc.extend(slikcalc.FormulaCalc, slikcalc.BaseCalc);

slikcalc.FormulaCalc.prototype.calcOnLoad = false;
slikcalc.FormulaCalc.prototype.registerListeners = false;
slikcalc.FormulaCalc.prototype.initialized = false;
slikcalc.FormulaCalc.prototype.formula = null;
slikcalc.FormulaCalc.prototype.formulaParsed = null;
slikcalc.FormulaCalc.prototype.resultVar = null;
slikcalc.FormulaCalc.prototype.varMatch = /\{(\w)\}/gi;
slikcalc.FormulaCalc.prototype.rows = null;

/**
 * Method run on page load to parse the formula, and pull out variables within it.
 */
slikcalc.FormulaCalc.prototype.initialize = function() {
	this.initialized = true;
	this.formulaParsed = this.formula;
	if(this.formulaParsed.indexOf('=') !== -1) {
		var formulaSplit = this.formulaParsed.split('=');
		this.formulaParsed = formulaSplit[0];
		this.resultVar = this.varMatch.exec(slikcalc.trim(formulaSplit[1]))[1];
	}
	this.varMatch.lastIndex = 0;
	while((result = this.varMatch.exec(this.formulaParsed)) !== null) {
		this.variables.push(result[1]);
	}
	this.varMatch.lastIndex = 0;
	if(this.calcOnLoad === true) {
		this.processCalculation();
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
slikcalc.FormulaCalc.prototype.addRow = function(rowConfig) {
	rowConfig = rowConfig || {};
	if(rowConfig.checkbox !== undefined) {
		slikcalc.addListener(rowConfig.checkbox.id, 'click', this.processCalculation, this);
		rowConfig.checkbox.invert = rowConfig.checkbox.invert || false;
	}
	for(var idx in rowConfig.vars) {
        if(rowConfig.vars.hasOwnProperty(idx)) {
            var variable = rowConfig.vars[idx];
            variable.defaultValue = variable.defaultValue || 0;
            rowConfig.registerListeners = rowConfig.registerListeners === true || (this.registerListeners === true && rowConfig.registerListeners !== false);
            if(rowConfig.registerListeners === true) {
                slikcalc.addListener(variable.id, 'keyup', this.keyupEvent, this);
            }
        }
	}
	this.rows.push(rowConfig);
};

/**
 * Processes the rows and applies the formula to each one.
 */
slikcalc.FormulaCalc.prototype.calculate = function() {
	if(this.initialized === false) {
		this.initialize();
	}
	var total = 0.00;
	for(var idx in this.rows) {
        if(this.rows.hasOwnProperty(idx)) {
            var includeRow = true;
            if(this.rows[idx].checkbox !== undefined) {
                var checkbox = this.rows[idx].checkbox;
				includeRow = (checkbox.invert !== slikcalc.get(checkbox.id).checked);
            }
            var rowTotal = 0;
    
            var formulaString = this.formulaParsed;
            for(var varIdx in this.variables) {
                if(this.variables.hasOwnProperty(varIdx)) {
                    var variableName = this.variables[varIdx];
                    var variable = this.rows[idx].vars[variableName];
                    var value = variable.defaultValue;
                    if(slikcalc.get(variable.id) !== null) {
                        value = slikcalc.getValue(variable.id);
                        value = value === '' ? variable.defaultValue : value;
                        value = slikcalc.formatCurrency(value);
                    }
                    var variableRegex = new RegExp("\\{" + variableName + "\\}");
                    formulaString = formulaString.replace(variableRegex, value);
                }
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
					total = this.calculateTotal(total, parseFloat(rowTotal));
                }
            }
        }
	}
	if(this.totalId !== null) {
		slikcalc.setAmount(this.totalId, total);
	}
};