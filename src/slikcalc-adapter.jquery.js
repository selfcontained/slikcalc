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
            listener: null,
            scope: null
        };
	},
	
	bindEvent : function(event, method, scope) {
        event.listener = method;
        event.scope = scope;
		jQuery(scope).bind(event.type, function(ev, scopeObj, methodObj) {
            method.call(scope);
		});
	},
	
	fireEvent : function(event) {
		jQuery(event.scope).trigger(event.type);
	},
	
	extend : function(originalObj, superObj) {
		jQuery.extend(originalObj, superObj);
	}	
}