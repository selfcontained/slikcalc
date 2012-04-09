/**
 * Adapter for handling dom/events
 */
var slikcalc;
(function () {
	"use strict";

	var domReady = false;

	function addListener(element, type, method, scope) {
		var cb = function () { method.call(scope); };
		element = typeof element === 'string' ? slikcalc.adapter.get(element) : element;
		if (element.addEventListener) {
			element.addEventListener(type, cb, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, cb);
		}
	}

	slikcalc.adapter = {

		get : function (id) {
			return document.getElementById(id);
		},

		addListener : function (element, type, cb, scope) {
			if (domReady) {
				addListener(element, type, cb, scope);
			} else {
				slikcalc.adapter.addOnLoad(function () {
					addListener(element, type, cb, scope);
				});
			}
		},

		addOnLoad : function (cb, scope) {
			addListener(window, 'load', cb, scope);
		},

		createCustomEvent : function (eventType) {
			return new slikcalc.adapter.Event();
		},

		bindEvent : function (event, cb, scope) {
			event.subscribe(cb, scope);
		},

		fireEvent : function (event) {
			event.fire();
		}

	};

	slikcalc.adapter.addOnLoad(function () {
		domReady = true;
	});

	slikcalc.adapter.Event = function () {
		this._subscribers = [];
	};
	slikcalc.adapter.Event.prototype = {

		_subscribers : null,

		subscribe : function (cb, scope) {
			this._subscribers.push({
				cb : cb,
				scope : scope
			});
		},

		fire : function () {
			var idx,
				subscriber;
			for (idx in this._subscribers) {
				if (this._subscribers.hasOwnProperty(idx)) {
					subscriber = this._subscribers[idx];
					subscriber.cb.call(subscriber.scope);
				}
			}
		}
	};

}());
