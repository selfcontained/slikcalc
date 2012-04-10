function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
			} else {
				if(!condition) {
					console.log("'waitFor()' timeout");
					phantom.exit(1);
				} else {
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady) : onReady();
					clearInterval(interval);
				}
			}
		},
		250)
	;
};

var page = require('webpage').create();

page.settings.javascriptEnabled = true;
page.settings.localToRemoteUrlAccessEnabled = true;
page.settings.loadImages = true;
page.settings.loadPlugins = true;
page.viewportSize = {
	width: 1024,
	height: 768
}

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.open(
	phantom.args[0],
	function(status){
		var timeout=10,
			exit = 1;

		if (status !== 'success') {
			console.log("can't open page: " + phantom.args[0]);
			phantom.exit(exit);
		} else {
			waitFor(
				function test(){
					return page.evaluate(function(){
						if(Y && Y.Test && Y.Test.Runner) {
							return !!Y.Test.Runner.getResults();
						} else {
							console.log('No global Y object to access test results');
							return true;
						}
					});
				},
				function onReady(){
					var data = page.evaluate(function(){
						if(window.Y && Y.Test.Runner) {
							return {
								js: Y.Test.Runner.getResults(),
								tap: Y.Test.Runner.getResults(Y.Test.Format.TAP)
							}
						} else {
							return false;
						}
					});

					if (data){
						console.log('Test results: '+ data.tap);
						if (data.js){
							exit = (parseInt(data.js.failed) > 0 ? 1: 0);
						}
					}
					phantom.exit(exit);
				},
				(timeout * 1000)
			);
		}
	}
);
