slikcalc.adapter = {
	
	get : function(id) {
		return YAHOO.util.Dom.get(id);
	},
	
	addListener : function(elementId, type, method, scope) {
		YAHOO.util.Event.addListener(elementId, type, method, scope, (scope !== undefined));
	},
	
	addOnLoad : function(method, scope) {
		this.addListener(window, 'load', method, scope);
	},
	
	createCustomEvent : function(eventType) {
		return new YAHOO.util.CustomEvent(eventType, this);
	},
	
	bindEvent : function(event, method, scope) {
		event.subscribe(method, scope, (scope !== undefined));
	},
	
	fireEvent : function(event) {
		event.fire();
	},
	
	extend : function(originalObj, superObj) {
		YAHOO.lang.extend(originalObj, superObj);
	}
}