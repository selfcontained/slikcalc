/**
 * Copyright (c) 2008 Brad Harris - bmharris@gmail.com
 * http://slikcalc.selfcontained.us
 * Code licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * version X.X
 */
 
var slikcalc;
if(!slikcalc) {
	slikcalc = {};
}else if (typeof slikcalc != 'object') {
	throw new Error('slikcalc already exists and is not an object');
}

/**
 * @namespace slikcalc
 */
slikcalc = {
	
	/**
	 * @description Reference to 3rd party library slikcalc adapter
	 */
	adapter : null,
	
	/**
	 * @description Gets the elements value.  This handles getting actual input values, 
	 * or inner text of an element, depending on the type of element
	 * @param {String/HTMLElement} el Element id or reference
	 * @returns {String} Elements value or innerHTML
	 */
	getValue : function(el) {
		var value = null, element = this.get(el);
		if(element !== null) {
			value = this.isInput(element) ? element.value : element.innerHTML;
		}
		return value;
	},
	
	/**
	 * @description Sets elements value or innerHTML depending on element type
	 * @param {String/HTMLElement} el Element ID or reference
	 * @param {String} value Value to set for the element passed in
	 */
	
	setValue : function(el, value) {
		var element = this.get(el);
		if(element !== null) {
			if(this.isInput(element)) {
				element.value = value;
			}else {
				element.innerHTML = value;
			}
		}
	},
	
	/**
	 * @description Returns an elements value or innerHTML as a float formatted as currency
	 * @param {String/HTMLElement} Element ID or reference
	 * @returns {Float} Float value of element, formatted as currency
	 */
	
	getAmount : function(el) {
		var amount = this.getValue(el);
		amount = amount !== null ? parseFloat(this.formatCurrency(amount)) : parseFloat(this.formatCurrency(0));
		return amount;
	},
	
	/**
	 * @description Sets elements value or innerHTML depending on element type formatted as currency
	 * @param {String/HTMLElement} el Element ID or reference to set
	 * @param {String/Number} value Amount to set, can be a string or number
	 */
	setAmount : function(el, value) {
		this.setValue(el, this.formatCurrency(value));
	},
	
	/**
	 * @description Determines if the element passed in is an HTML input
	 * @param {String/HTMLElement} element
	 * @returns {Boolean} true/false if the element is an HTML input
	 */
	isInput : function(element) {
		return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT';
	},

	/**
	 * @description returns a Float of two decimal places from the provided String/Number.  
	 * Returns 0.00 if no number or an improperly formatted String is passed in
	 * @param {String/Number} num
	 * @return {Float} Float value of set to two decimal places.
	 */
	formatCurrency : function(num) {
		if(num !== undefined && typeof num === "string") {
			num = num.replace(/[$,]/, '');
		}
		num = isNaN(num) || num === '' || num === null ? 0.00 : num;
		return parseFloat(num).toFixed(2);
    },
	
	/**
	 * @description Removes whitespace from the head/tail of a string
	 * @param {String} string
	 * @returns {String}
	 */
    trim : function(string) {
		return string.replace(/^\s+|\s+$/g, '');
	},
	
	/**
	 * @description Retrieves an HTML Element by delegating to the adapter library.
	 * @param {String/HTMLElement} id
	 */
	get : function(id) {
		this.validateAdapter();
		return this.adapter.get(id);
	},
	
	/**
	 * @description Ensures that the slikcalc 3rd party library adapter has been set.
	 */
	validateAdapter : function() {
	    if(this.adapter === null) {
			throw new Error('slikcalc requires an external javascript library adapter');
		}
	},
	
	/**
	 * @description Adds an event listener to the element passed in.
	 * @param {String/HTMLElement} elementId Element to attach event to
	 * @param {String} type String representation of the type of event to attach to
	 * @param {Function} method Reference to a callback method to fire when the event fires
	 * @param {Object} scope (Optional) Scope object to use when executing the callback if required
	 */
	addListener : function(elementId, type, method, scope) {
		this.validateAdapter();
		this.adapter.addListener(elementId, type, method, scope);
	},
	
	/**
	 * @description Attaches an event to the onLoad event of the page
	 * @param {Function} method Reference to a callback method to fire when the onLoad event fires
	 * @param {Object} scope (Optional) Scope object to use when executing the callback if required
	 */
	addOnLoad : function(method, scope) {
		this.validateAdapter();
		this.adapter.addOnLoad(method, scope);
	},
	
	/**
	 * @description Creates a custom event through delegating to the 3rd party library adapter.
	 * This custom event is used internally for slikcalc custom events.
	 * @param {String} eventType String identifier for custom event type
	 * @returns {Object} Custom event object for internal slikcalc use
	 */
	createCustomEvent : function(eventType) {
	    this.validateAdapter();
		return this.adapter.createCustomEvent(eventType);
	},
	
	/**
	 * @description Binds the provided callback to the custom event passed in.  This delegates to the 3rd party library adapter
	 * @param {Object} event Reference to slikcalc custom event
	 * @param {Object} method Callback method to bind to the custom event
	 * @param {Object} scope (Optional) Scope object to use when executing the callback if required
	 */
	bindEvent : function(event, method, scope) {
	    this.validateAdapter();
		this.adapter.bindEvent(event, method, scope);
	},
	
	/**
	 * @description Triggers the custom event passed in
	 * @param {Object} event Reference to slikcalc custom event to fire
	 */
	fireEvent : function(event) {
	    this.validateAdapter();
		this.adapter.fireEvent(event);
	},
	
	/**
	 * @description Utility method for class extension.  Copies the prototype of the superclass onto the subclass
	 * @param {Object} subc Subclass 
	 * @param {Object} superc Superclass
	 */
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
	},
	
	/**
	 * @description Factory method for creating calculator objects
	 * @param {String} type String representing the type of calculator to create.  Either 'column' or 'formula'.
	 * @param {Object} config config object for calculator being created, see calculators constructor for options.
	 * @returns {slikcalc.BaseCalc} Returns the concrete type of slikcalc.BaseCalc specified
	 */
	create : function(type, config) {
		var calcType = type === 'column' ? slikcalc.ColumnCalc : type === 'formula' ? slikcalc.FormulaCalc : null;
		return calcType !== null ? new calcType(config) : null;
	}
	
};
/**
 * @class BaseCalc
 * @constructor
 * @description Base Calculator class handles common configuration options, provides utility methods, an interface for extending, 
 * and runs calculator's initialize method on page load if it exists.
 * @param {Object} config Configuration object with the following options:
 * <ul>
 * 	<li>total.id : (Optional) Element ID to place end result of column calculation</li>
 *  <li>total.operator : (Optional) ( +, -, *, x, / ) Mathematical operator to apply against each row to produce end result.  Defaults to '+'</li>
 *  <li>calcOnLoad : (Optional) Defaults to false. If true, on page load the calculate method is fired</li>
 *  <li>registerListeners : (Optional) Defaults to false. If true, event listeners are attached to inputs that fire the calculate method</li>
 * </ul>
 */
slikcalc.BaseCalc = function(config) {
    config.total = config.total || {};
	this.totalId = config.total.id || null;
	this.totalOperator = config.total.operator || '+';
	this.calcOnLoad = config.calcOnLoad || false;
	this.calculationComplete = slikcalc.createCustomEvent('calculationComplete');
	this.registerListeners = config.registerListeners || false;
	slikcalc.addOnLoad(this.baseInitialize, this);
};

slikcalc.BaseCalc.prototype = {

	/**
	 * @description Reference to slikcalc custom event to fire when the calculation has been 
	 * completed for this calculator
	 */
	calculationComplete : null,
	
	/**
	 * @description Internal value of the time when the last keyup event fired used to make sure and
	 * fire the calculate event only after there is a delay in typing for performance reasons
	 */
	lastKeyUp : null,
	
	/**
	 * @description Internal value tracking the number of calculations triggered used to prevent callbacks from firing out of synch
	 */
	calculations : 0,
	
	/**
	 * @description Element ID for the total value of the calculator
	 */
	totalId : null,
	
	/**
	 * @description Mathematical operator to apply against each row to produce end result ( +, -, *, x, / )
	 */
	totalOperator : null,
	
	/**
	 * @description Boolean value to signal if the calculator should fire initially when the page loads
	 */
	calcOnLoad : false,
	
	/**
	 * @description Boolean value indicating if event listeners should be placed on relevant elements to tracking key events and clicking
	 */
	registerListeners : false,
	
	/**
	 * @description Configuration value for the pause in keyup events to wait for before calculating.  
	 * Setting this to zero will cause calculations to perform on each keyup event, which could become costly with many calculators
	 * chained together
	 */
	keyupDelay: 600,
	
	/**
	 * @description Internal boolean to track if the calculator has been initialized yet
	 */
	initialized : false,
	
	/**
	 * @description Base initialize method to handle calling subclass initialize(), and sets initialized property.
	 * Also calls processCalculation() if calcOnLoad is true
	 */
	baseInitialize : function() {
		if(this.initialized === false) {
			this.initialized = true;
			if(this.initialize !== undefined && typeof this.initialize === 'function') {
			    this.initialize();
			}
			if(this.calcOnLoad === true) {
				this.processCalculation();
			}
		}
	},
	
	/**
	 * @description Sets up event chaining for BaseCalc objects.  The object passed in is returned to allow for a fluent interface
	 * this.calculate will be called after dependCalc.calculate
	 * @param {BaseCalc} dependCalc BaseCalc object to attach event to
	 */
	dependsOn : function(dependCalc) {
		slikcalc.bindEvent(dependCalc.calculationComplete, this.processCalculation, this);
		return dependCalc;
	},
	
	/**
	 * @description Sets up event chaining for BaseCalc objects.  The object passed in is returned to allow for a fluent interface
	 * this.calculate will be called before triggeredCalc.calculate
	 * @param {BaseCalc} triggeredCalc BaseCalc object to attach event to
	 */
	triggers : function(triggeredCalc) {
		slikcalc.bindEvent(this.calculationComplete, triggeredCalc.processCalculation, triggeredCalc);
		return triggeredCalc;
	},
	
	/**
	 * @description Wrapper method to trigger processCalculation when there is a pause in users key events
	 */
	keyupEvent : function() {
		this.lastKeyup = new Date().getTime();
		this.calculations = this.calculations + 1;
		var that = this, calculation = this.calculations;
		setTimeout(function() {
			var currentTime = new Date().getTime(), difference = currentTime - that.lastKeyup;
			if(calculation == that.calculations && difference > that.keyupDelay) {
				that.processCalculation();
			}
		}, (this.keyupDelay+100));
	},
	
	/**
	 * @description Calculates the total amount, dependant upon the totalOperator value.  
	 * Seperated into conditional statements for better performance than using 'eval()', and to handle operator unique functionality
	 * @param {Float} total Initial value of total.
	 * @param {Float} amount New amount to calculate in conjunction with total.
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
	
	/**
	 * @description Wrapper method for concrete class' `calculate` method
	 */
	processCalculation: function() {
		if(this.initialized === false) {
			this.baseInitialize();
		}
        this.calculate();
    	slikcalc.fireEvent(this.calculationComplete);
	},
	
	/**
	 * @description Abstract method to be implemented in sub-classes.
	 */
	calculate : function() {
		throw new Error('Must implement calculate method in sub-class of BaseCalc');
	}
};
/**
 * @class ColumnCalc
 * @description Calculator ojbect for performing column-based calculations
 * @constructor
 * @param {Object} config (Required) Configuration object, see slikcalc.BaseCalc for options
 */
slikcalc.ColumnCalc = function(config) {
	this.parent.constructor.call(this, config);
	this.rows = [];
};
slikcalc.extend(slikcalc.ColumnCalc, slikcalc.BaseCalc);

/**
 * @description {Array} Array of row objects to use in calculator
 */
slikcalc.ColumnCalc.prototype.rows = null;

/**
 * @description Runs on page load.  Sets up event listeners if registerEventListeners is set to true.
 */
slikcalc.ColumnCalc.prototype.initialize = function() {
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
 * @param {Object} config Configuration object for row definitions, with the following options:
 * <ul>
 * 	<li>id : Element id that holds the value to calculate</li>
 *  <li>checkbox.id : (Optional) Element id of checkbox</li>
 *  <li>checkbox.invert : Defaults to false. If true, row is included in total calculcation when un-checked, and omitted when checked</li>
 * </ul>
 */
slikcalc.ColumnCalc.prototype.addRow = function(rowConfig) {
	rowConfig = rowConfig || {};
	if(rowConfig.checkbox !== undefined) {
		rowConfig.checkbox.invert = rowConfig.checkbox.invert || false;
	}
	this.rows.push(rowConfig);
};
/**
 * @class FormulaCalc
 * @description Calculator object that calculates based on a given formula and mapped variables.  Calculates across multiple rows as well,
 * updating a single totals value based on a given mathematical operator.
 * @constructor
 * @param {Object} config Configuration object, all options of slikcalc.BaseCalc plus the following:
 * <ul>
 * 	<li>formula : Mathematical formula in string form.  Variables denoted within the '{}' that map to vars definitions passed in on the addRow method.  Example: "{a} + {b} = {c}".  "{a} + {b}" is used as the formula, and {c} becomes the position that the eval'd result is placed into.</li>
 *  <li>total.vars : Variables configuration object, see slikcalc.FormulaCalc.addRow() for details.  If passed in here, an initial row is added</li>
 * </ul>
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

/**
 * @description Formula used to calculate the total for a row
 */
slikcalc.FormulaCalc.prototype.formula = null;

/**
 * @description Holds the formula value once it has been parsed, and the equality portion has been removed
 */
slikcalc.FormulaCalc.prototype.formulaParsed = null;

/**
 * @description Property to hold the variable from the formula that specifies where the result goes
 */
slikcalc.FormulaCalc.prototype.resultVar = null;

/**
 * @description Regular Expression to find variables in the formula
 */
slikcalc.FormulaCalc.prototype.varMatch = /\{(\w)\}/gi;

/**
 * @description {Array} Array of row objects for the calculator
 */
slikcalc.FormulaCalc.prototype.rows = null;

/**
 * @description {Array} Array of the variables parsed from the formula
 */
slikcalc.FormulaCalc.prototype.variables = null;

/**
 * @description Method run on page load to parse the formula, and pull out variables within it.  
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
};

/**
 * @description Adds a row to the calculator to be included in the calculations
 * @param {Object} rowConfig Configuration object for the row being added to the calculator.  It may contain the following options:
 * <ul>
 *  <li>vars : Object containing one to many variable definitions</li>
 *  <li>vars.x : Configuration object for variable 'x' where x represents a variable in the formula</li>
 *  <li>vars.x.id : Element id for the input mappted to variable 'x' in formula</li>
 *  <li>vars.x.defaultValue : (Optional) Value used in place of empty/null for variable 'x'.  Defaults to 0</li>
 *  <li>checkbox.id : Element id of checkbox. Required if config[checkbox] included</li>
 *  <li>checkbox.invert : Defaults to false. If true, row is included in total calculcation when un-checked, and omitted when checked</li>
 * </ul>
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
            var includeRow = true, rowTotal, formulaString = this.formulaParsed;
            if(this.rows[idx].checkbox !== undefined) {
                var checkbox = this.rows[idx].checkbox;
				includeRow = (checkbox.invert !== slikcalc.get(checkbox.id).checked);
            }
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