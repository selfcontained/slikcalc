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
			if(num.indexOf(',') !== -1) {
				num = num.replace(",", '');
			}
			if(num.indexOf('$') !== -1) {
				num = num.replace("$", '');
			}
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