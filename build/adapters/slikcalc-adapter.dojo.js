slikcalc.adapter = {
	
	eventTopicCounter : 0,
	
	get : function(id) {
        return dojo.byId(id);
	},
	
	addListener : function(id, type, method, scope) {
        dojo.connect(this.get(id), 'on'+type, function() {
        	method.call(scope);
        });
	},
	
	addOnLoad : function(method, scope) {
		dojo.addOnLoad(function() {
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
        dojo.subscribe(event.topic, function() {
        	method.call(scope);
        });
	},
	
	fireEvent : function(event) {
		dojo.publish(event.topic);
	}	
};