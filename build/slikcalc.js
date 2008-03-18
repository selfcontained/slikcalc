/**
 * Copyright (c) 2008 Brad Harris - bmharris@gmail.com
 * http://slikcalc.selfcontained.us
 * Code licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * version 1.0b
 */
var slikcalc;
if(!slikcalc) {
	slikcalc = {};
}else if (typeof slikcalc != 'object') {
	throw new Error('slikcalc already exists and is not an object');
}

slikcalc = {
	
	adapter : null,
	
	getValue : function(el) {
		var value = null;
		var element = this.get(el);
		if(element !== null) {
			if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA' || element.tagName == 'SELECT') {
				value = element.value;
			}else {
				value = element.innerHTML;
			}
		}
		return value;
	},
	
	setValue : function(el, value) {
		var element = this.get(el);
		if(element !== null) {
			if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA' || element.tagName == 'SELECT') {
				element.value = value;
			}else {
				element.innerHTML = value;
			}
		}
	},
	
	getAmount : function(el) {
		var amount = this.getValue(el);
		if(amount !== null) {
			amount = parseFloat(this.formatCurrency(amount));
		}else {
			amount = parseFloat(this.formatCurrency(0));
		}
		return amount;
	},
	
	setAmount : function(el, value) {
		this.setValue(el, this.formatCurrency(value));
	},
	
	formatCurrency : function(num) {
		num = num === null ? 0.00 : num;
	    num = num.toString().replace(/\$|\,/g,'');
        if(isNaN(num)) {
            num = "0";
        }
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        var cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10) {
            cents = "0" + cents;
        }
        return ( ( (sign) ? '' : '-' ) + '' + num + '.' + cents);
    },
    
    trim : function(string) {
		return string.replace(/^\s+|\s+$/g, '');
	},
	
	get : function(id) {
		if(this.adapter === null) {
			throw new Error('slikcalc requires an external javascript library adapter');
		}
		return this.adapter.get(id);
	},
	
	validateAdapter : function() {
	    if(this.adapter === null) {
			throw new Error('slikcalc requires an external javascript library adapter');
		}
	},
	
	addListener : function(elementId, type, method, scope) {
		this.validateAdapter();
		this.adapter.addListener(elementId, type, method, scope);
	},
	
	addOnLoad : function(method, scope) {
		this.validateAdapter();
		this.adapter.addOnLoad(method, scope);
	},
	
	createCustomEvent : function(eventType) {
	    this.validateAdapter();
		return this.adapter.createCustomEvent(eventType);
	},
	
	bindEvent : function(event, method, scope) {
	    this.validateAdapter();
		this.adapter.bindEvent(event, method, scope);
	},
	
	fireEvent : function(event) {
	    this.validateAdapter();
		this.adapter.fireEvent(event);
	},
	
	extend : function(subc, superc) {
		if (! superc || ! subc) {
			throw new Error('slikcalc.extend failed, please check that all dependencies are included.');
		}
	
		var F = function() {};
		F.prototype = superc.prototype;
		subc.prototype = new F();
		subc.prototype.constructor = subc;
		subc.prototype.parent = superc.prototype;
		subc.prototype.parent.constructor = superc;
	}
	
};

/**
 * @namespace slikcalc
 * @class BaseCalc
 * @constructor
 * @description Base Calculator class handles common configuration options, provides utility methods, an interface for extending, 
 * and runs calculator's initialize method on page load if it exists.
 * @param {String}	config[total][id]				(Optional) Element ID to place end result of column calculation
 * @param {String}	config[total][operator]			(Optional) ( +, -, *, x, / ) Mathematical operator to apply against each row to produce end result.  Defaults to '+'
 * @param {boolean}	config[calcOnLoad]				(Optional) Defaults to false. If true, on page load the calculate method is fired.
 * @param {boolean}	config[registerListeners] 		(Optional) Defaults to false. If true, event listeners are attached to inputs that fire the calculate method
 */
slikcalc.BaseCalc = function(config) {
    config.total = config.total || {};
	this.totalId = config.total.id || null;
	this.totalOperator = config.total.operator || '+';
	this.calcOnLoad = config.calcOnLoad || false;
	this.calculationComplete = slikcalc.createCustomEvent('calculationComplete');
	this.registerListeners = config.registerListeners || false;
	if(this.initialize !== undefined && typeof this.initialize === 'function') {
	    slikcalc.addOnLoad(this.initialize, this);
	}
};

slikcalc.BaseCalc.prototype = {

	calculationComplete : null,
	
	lastKeyUp : null,
	
	calculations : 0,
	
	totalId : null,
	
	totalOperator : null,
	
	calcOnLoad : false,
	
	registerListeners : false,
	
	keyupDelay: 600,
	
	/**
	 * Sets up event chaining for BaseCalc objects.  The object passed in is returned to allow for a fluent interface
	 * this.calculate will be called after dependCalc.calculate
	 */
	dependsOn : function(dependCalc) {
		slikcalc.bindEvent(dependCalc.calculationComplete, this.processCalculation, this);
		return dependCalc;
	},
	
	/**
	 * Sets up event chaining for BaseCalc objects.  The object passed in is returned to allow for a fluent interface
	 * this.calculate will be called before triggeredCalc.calculate
	 */
	triggers : function(triggeredCalc) {
		slikcalc.bindEvent(this.calculationComplete, triggeredCalc.processCalculation, triggeredCalc);
		return triggeredCalc;
	},
	
	keyupEvent : function() {
		this.lastKeyup = new Date().getTime();
		var that = this;
		this.calculations = this.calculations + 1;
		var calculation = this.calculations;
		setTimeout(function() {
			var currentTime = new Date().getTime();
			var difference = currentTime - that.lastKeyup;
			if(calculation == that.calculations && difference > that.keyupDelay) {
				that.processCalculation();
			}
		}, (this.keyupDelay+100));
	},
	
	/**
	 * Calculates the total amount, dependant upon the totalOperator value.  
	 * Seperated into conditional statements for better performance than using 'eval(), and to handle operator unique functionality'
	 */
	calculateTotal : function(total, amount) {
		if(this.totalOperator === '+') {
			total = total === null ? 0.00 : total;
            total = total + amount;
        }else if(this.totalOperator === '-') {
			if(total === null) {
				total = amount;
			}else {
				total = total - amount;
			}
		}else if(this.totalOperator === '*' || this.totalOperator === 'x') {
			total = total === null ? 1 : total;
			total = total * amount;
		}else if(this.totalOperator === '/') {
			if(total === null) {
				total = amount;
			}else {
				total = total / amount;
			}
		}
		return total;
	},
	
	processCalculation: function() {
        this.calculate();
    	slikcalc.fireEvent(this.calculationComplete);
	},
	
	/**
	 * Abstract method to be implemented in sub-classes.
	 */
	calculate : function() {
		throw new Error('Must implement calculate method in sub-class of BaseCalc');
	}
};

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

slikcalc.FormulaCalc.prototype.initialized = false;
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