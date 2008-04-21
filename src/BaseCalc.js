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
	slikcalc.addOnLoad(this.baseInitialize, this);
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
	
	initialized : false,
	
	/**
	 * Base initializing method
	 */
	baseInitialize : function() {
		if(this.initialized === false) {
			this.initialized = true;
			if(this.initialize !== undefined && typeof this.initialize === 'function') {
			    this.initialize();
			}
		}
	},
	
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
	
	/**
	 * Wrapper method to trigger processCalculation when there is a pause in users key events
	 */
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
	
	/**
	 * Wrapper method for concrete class' `calculate` method
	 */
	processCalculation: function() {
		if(this.initialized === false) {
			this.baseInitialize();
		}
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