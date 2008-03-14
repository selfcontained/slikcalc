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
        return (((sign)?'':'-') + '' + num + '.' + cents);
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
	
	addListener : function(elementId, type, method, scope) {
		if(this.adapter === null) {
			throw new Error('slikcalc requires an external javascript library adapter');
		}
		this.adapter.addListener(elementId, type, method, scope);
	},
	
	addOnLoad : function(method, scope) {
		if(this.adapter === null) {
			throw new Error('slikcalc requires an external javascript library adapter');
		}
		this.adapter.addOnLoad(method, scope);
	},
	
	createCustomEvent : function(eventType) {
		return this.adapter.createCustomEvent(eventType);
	},
	
	bindEvent : function(event, method, scope) {
		this.adapter.bindEvent(event, method, scope);
	},
	
	fireEvent : function(event) {
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