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