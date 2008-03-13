slikcalc.adapter = {

	get : function(id) {
		var element = $(id);
        return element;
	},
	
	addListener : function(id, type, method, scope) {
        this.addOnLoad(function() {
            $(id).observe(type, function() {
               method.call(scope); 
            });
        });
	},
	
	addOnLoad : function(method, scope) {
		Element.observe(window, 'load', function() {
            method.call(scope);
        });
	},
	
	createCustomEvent : function(eventType) {
		return {
            event: 'slikcalc:' + eventType,
            scope: null
        }
	},
	
	bindEvent : function(event, method, scope) {
        event.scope = scope;
        Element.observe(scope, event.type, function() {
            method.call(scope);    
        });
	},
	
	fireEvent : function(event) {
		event.scope.fire(event.type);
	}
    
}