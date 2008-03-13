slikcalc.adapter = {

	get : function(id) {
		return jQuery('#'+id)[0];
	},
	
	addListener : function(id, type, method, scope) {
        this.addOnLoad(function() {
            jQuery('#'+id).bind(type, function() {
                method.call(scope);
            });
        });
	},
	
	addOnLoad : function(method, scope) {
		jQuery(function() {
			method.call(scope);
		});
	},
	
	createCustomEvent : function(eventType) {
		return {
            type: eventType,
            scope: null
        };
	},
	
	bindEvent : function(event, method, scope) {
        event.scope = scope;
		jQuery(scope).bind(event.type, function() {
            method.call(scope);
		});
	},
	
	fireEvent : function(event) {
		jQuery(event.scope).trigger(event.type);
	}
    
}