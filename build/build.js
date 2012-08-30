var buildy = require('buildy'),
	VERSION = require('../package.json').version,
	OUTPUT_RAW = __dirname+'/slikcalc.js',
	OUTPUT_MIN = __dirname+'/slikcalc.min.js',
	jslint = {
		browser: true,
		nomen: true,
		evil: true //FormulaCalc has to use eval
	},
	templateRaw = {
		template_file : __dirname+'/build.hb',
		template_vars : {
			year : (new Date()).getFullYear(),
			version : VERSION
		}
	},
	// buildy doesn't clone this object, it will cause issues to reuse the same build object more than once
	templateMin = {
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
				.task('template', templateRaw)
				.task('write', { name: OUTPUT_RAW } )
				.run();
		},
		'minified version' : function() {
			this
				.task('jsminify')
				.task('template', templateMin)
				.task('write', { name: OUTPUT_MIN } )
				.run();
		}
	})
	.run();
