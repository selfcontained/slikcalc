(function() {
	headerCalc1 = new slikcalc.FormulaCalc({
		formula: '( {a} / {b} ) + {c} = {d}',
		vars: {
			a: { id: 'header-1-1' },
			b: { id: 'header-1-2' },
			c: { id: 'header-1-3'},
			d: { id: 'header-1-total'}
		},
		registerListeners: true,
		calcOnLoad: true
	});
	headerCalc2 = new slikcalc.FormulaCalc({
		formula: '( {a} * {b} ) + {c} = {d}',
		vars: {
			a: { id: 'header-2-1' },
			b: { id: 'header-2-2' },
			c: { id: 'header-2-3'},
			d: { id: 'header-2-total'}
		},
		registerListeners: true,
		calcOnLoad: true
	});
	headerTotalsCalc = new slikcalc.FormulaCalc({
	   formula: '{a} + {b} = {c}',
	   vars: {
		   a: { id: 'header-1-total' },
		   b: { id: 'header-2-total' },
		   c: { id: 'header-totals' }
	   }
	});
	headerCalc1.triggers(headerTotalsCalc);
	headerCalc2.triggers(headerTotalsCalc);
})();