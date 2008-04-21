/**
 * @namespace slikcalc
 * @class FormulaCalc
 * @description Calculator object that calculates based on a given formula and mapped variables.  Calculates across multiple rows as well,
 * updating a single totals value based on a given mathematical operator.
 * @constructor
 * @param {String}	config[formula]			(Required) Mathematical formula in string form.  Variables denoted within the '{}' that map to vars definitions
 * passed in on the addRow method.  Example: "{a} + {b} = {c}".  "{a} + {b}" is used as the formula, 
 * and {c} becomes the position that the eval'd result is placed into.
 * @param {object}	config[total][vars]		Variables configuration object, see FormulaCalc.addRow() for details
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

slikcalc.FormulaCalc.prototype.formula = null;
slikcalc.FormulaCalc.prototype.formulaParsed = null;
slikcalc.FormulaCalc.prototype.resultVar = null;
slikcalc.FormulaCalc.prototype.varMatch = /\{(\w)\}/gi;
slikcalc.FormulaCalc.prototype.rows = null;
slikcalc.FormulaCalc.prototype.variables = null;

/**
 * @description Method run on page load to parse the formula, and pull out variables within it.  
 * Also processes the calculation if calcOnLoad is true.
 */
slikcalc.FormulaCalc.prototype.initialize = function() {
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
 * @description Adds a row to the calculator to be included in the calculations
 * @param {object}	vars						(Required) Object containing one to many variable definitions
 * @param {object}	vars[x]						(Required) Configuration object for variable 'x' where x represents a variable in the formula
 * @param {String}	vars[x][id]					(Required) Element id for the input mappted to variable 'x' in formula
 * @param {decimal}	vars[x][defaultValue]		(Optional) Value used in place of empty/null for variable 'x'.  Defaults to 0
 * @param {String}	config[checkbox][id]		(Optional) Element id of checkbox. Required if config[checkbox] included
 * @param {boolean}	config[checkbox][invert]	(Optional) Defaults to false. If true, row is included in total calculcation when un-checked, and omitted when checked
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
 * @description Processes the rows and applies the formula to each one.
 */
slikcalc.FormulaCalc.prototype.calculate = function() {
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
                slikcalc.setAmount(resultId, rowTotal);
            }
            if(includeRow === true && this.totalOperator !== null) {
				total = this.calculateTotal(total, parseFloat(rowTotal));
            }
        }
	}
	if(this.totalId !== null) {
		slikcalc.setAmount(this.totalId, total);
	}
};