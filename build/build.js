var buildy = require('buildy'),
	VERSION = '2.0.0',
	OUTPUT_RAW = __dirname+'/slikcalc.js',
	OUTPUT_MIN = __dirname+'/slikcalc.min.js',
	jslint = {
		browser: true,
		nomen: true,
		evil: true //FormulaCalc has to use eval
	},
	buildTemplate = {
		template_file : __dirname+'/build.hb',
		template_vars : {
			year : (new Date()).getFullYear(),
			version : VERSION
		}
	};

new buildy.Queue('compile js')
	.task('files', [
		__dirname+'/../src/slikcalc.js',
		__dirname+'/../src/slikcalc.adapter.js',
		__dirname+'/../src/BaseCalc.js',
		__dirname+'/../src/ColumnCalc.js',
		__dirname+'/../src/FormulaCalc.js'])
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
