slikcalc.adapter = {
	
	eventTopicCounter : 0,
	
	get : function(id) {
		return $(id);
	},
	
	addListener : function(elementId, type, method, scope) {
		var element = this.get(elementId);
		if(element === null) {
			this.addOnLoad(function() {
				$(elementId).addEvent(type, function() {
					method.call(scope);	
				});
			});
		}else {
			$(elementId).addEvent(type, function() {
				method.call(scope);	
			});
		}
	},
	
	addOnLoad : function(method, scope) {
		$(window).addEvent('load', function() {
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
		$(document).addEvent(event.topic, function() {
            method.call(scope);    
        });
	},
	
	fireEvent : function(event) {
		$(document).fireEvent(event.topic);
	}
		
};