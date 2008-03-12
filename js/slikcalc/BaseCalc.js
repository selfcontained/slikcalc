/**
 * @class jsi.widgets.calc.BaseCalc
 * Base Calculator class.  Defines base utility methods for Calculator objects along with a common interface for extending.
 */
 
/**
 * @constructor
 */
BaseCalc = function() {
	this.calculationComplete = new YAHOO.util.CustomEvent("calculationComplete", this);
};

/**
 * @prototype
 */
BaseCalc.prototype = {

	calculationComplete : null,
	
	lastKeyUp : null,
	
	calculations: 0,
	
	/**
	 * Sets up event chaining for BaseCalc objects.  The object passed in is returned to allow for a fluent interface
	 * this.calculate will be called after dependCalc.calculate
	 */
	dependsOn : function(dependCalc) {
		dependCalc.calculationComplete.subscribe(this.calculate, this, true);
		return dependCalc;
	},
	
	/**
	 * Sets up event chaining for BaseCalc objects.  The object passed in is returned to allow for a fluent interface
	 * this.calculate will be called before triggeredCalc.calculate
	 */
	triggers : function(triggeredCalc) {
		this.calculationComplete.subscribe(triggeredCalc.calculate, triggeredCalc, true);
		return triggeredCalc;
	},
	
	calculateCheck : function() {
		this.lastKeyup = new Date().getTime();
		var that = this;
		this.calculations = this.calculations + 1;
		var calculation = this.calculations;
		setTimeout(function() {
			var currentTime = new Date().getTime();
			var difference = currentTime - that.lastKeyup;
			if(calculation == that.calculations && difference > 600) {
				that.calculate();
			}
		}, 700);
	},
	
	calculate : function() {
		throw new Error('Must implement calculate method in sub-class of BaseCalc');
	}
};