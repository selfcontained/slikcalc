var buildy = require('buildy'),
	VERSION = '2.0.0',
	OUTPUT_RAW = __dirname+'/build/slikcalc.js',
	OUTPUT_MIN = __dirname+'/build/slikcalc.min.js',
	jslint = {
		browser: true,
		nomen: true,
		evil: true //FormulaCalc has to use eval
	},
	buildTemplate = {
		template_file : './src/build.hb',
		template_vars : {
			year : (new Date()).getFullYear(),
			version : VERSION
		}
	};

new buildy.Queue('compile js')
	.task('files', [
		'./src/slikcalc.js',
		'./src/slikcalc.adapter.js',
		'./src/BaseCalc.js',
		'./src/ColumnCalc.js',
		'./src/FormulaCalc.js'])
	.task('concat')
	.task('jslint', jslint)
	.task('fork', {
		'raw version' : function() {
			this
				.task('template', buildTemplate)
				.task('write', { name: OUTPUT_RAW } )
				.run();
		},
		'minified version' : function() {
			this
				.task('template', buildTemplate)
				.task('jsminify').task('write', { name: OUTPUT_MIN } )
				.run();
		}
	})
	.run();
