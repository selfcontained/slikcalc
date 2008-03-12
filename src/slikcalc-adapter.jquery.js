slikcalc.adapter = {

	get : function(id) {
		return jQuery('#'+id)[0];
	},
	
	addListener : function(id, type, method, scope) {
		jQuery('#'+id).bind(type, function() {
			if(scope !== undefined) {
				method.call(scope);
			}else {
				method.call();
			}
		});
	},
	
	addOnLoad : function(method, scope) {
		jQuery(function() {
			if(scope !== undefined) {
				method.call(scope);
			}else {
				method.call();
			}
		});
	},
	
	createCustomEvent : function(eventType) {
		return eventType;
	},
	
	bindEvent : function(event, method, scope) {
		jQuery(document).bind(event, function() {
			if(scope !== undefined) {
				method.call(scope);
			}else {
				method.call();
			}
		});
	},
	
	fireEvent : function(event) {
		jQuery(document).trigger(event);
	},
	
	extend : function(originalObj, superObj) {
		jQuery.extend(originalObj, superObj);
	}	
}