slikcalc.adapter = {

	eventTopicCounter : 0,
	
	get : function(id) {
		return $(id);
	},
	
	addListener : function(id, type, method, scope) {
		if(this.get(id) === null) {
			this.addOnLoad(function() {
	            $(id).observe(type, function() {
	               method.call(scope); 
	            });
	        });
		}else {
			$(id).observe(type, function() {
               method.call(scope); 
            });
		}
	},
	
	addOnLoad : function(method, scope, element) {
		Event.observe(window, 'load', function() {
            method.call(scope);
        });
	},
	
	createCustomEvent : function(eventType) {
		this.eventTopicCounter = this.eventTopicCounter + 1;
		return {
			topic: "slikcalc:" + eventType + this.eventTopicCounter
		}
	},
	
	bindEvent : function(event, method, scope) {
        document.observe(event.topic, function() {
            method.call(scope);    
        });
	},
	
	fireEvent : function(event) {
		document.fire(event.topic);
	}
    
};