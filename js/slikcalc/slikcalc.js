var slikcalc;
if(!slikcalc) {
	slikcalc = {};
}else if (typeof slikcalc != 'object') {
	throw new Error('slikcalc already exists and is not an object');
}

slikcalc = {
	
	getValue : function(el) {
		var value = null;
		var element = YAHOO.util.Dom.get(el);
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
		var element = YAHOO.util.Dom.get(el);
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
		// num = num || 0;
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
    }
}