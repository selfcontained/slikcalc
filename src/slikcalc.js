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
			value = this.isInput(element) ? element.value : element.innerHTML;
		}
		return value;
	},
	
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
	
	getAmount : function(el) {
		var amount = this.getValue(el);
		amount = amount !== null ? parseFloat(this.formatCurrency(amount)) : parseFloat(this.formatCurrency(0));
		return amount;
	},
	
	setAmount : function(el, value) {
		this.setValue(el, this.formatCurrency(value));
	},
	
	isInput : function(element) {
		return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT';
	},
	
	formatCurrency : function(num) {
		num = isNaN(num) || num === '' || num === null ? 0.00 : num;
		return parseFloat(num).toFixed(2);
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