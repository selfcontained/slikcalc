/**
 * @class slikcalc.BaseCalc
 * Base Calculator class.  Defines base utility methods for Calculator objects along with a common interface for extending.
 */
 
/**
 * @constructor
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
			if(calculation == that.calculations && difference > 600) {
				that.processCalculation();
			}
		}, 700);
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