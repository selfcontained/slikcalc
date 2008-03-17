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
    
    
    var columnCalc1 = new slikcalc.ColumnCalc({
		total: { id: 'cc-1-total' },
		registerListeners: true,
		calcOnLoad: true
	});
	columnCalc1.addRow({ id: 'cc-1-1' });
	columnCalc1.addRow({ id: 'cc-1-2' });
	columnCalc1.addRow({
		id: 'cc-1-3',
		checkbox: { id: 'cc-1-3-c' } 
	});
	var columnCalc2 = new slikcalc.ColumnCalc({
		total: { id: 'cc-2-total' },
		registerListeners: true,
		calcOnLoad: true,
		totalOperator: '*'
	});
	columnCalc2.addRow({ id: 'cc-2-1' });
	columnCalc2.addRow({ id: 'cc-2-2' });
	columnCalc2.addRow({
		id: 'cc-2-3',
		checkbox: { 
			id: 'cc-2-3-c', 
			invert: true
		} 
	});
	
	var formulaCalc1 = new slikcalc.FormulaCalc({
    	formula: '( {a} / {b} ) + {c} = {d}',
    	total: { id: 'formula-1-total' },
    	registerListeners: true,
    	calcOnLoad: true,
    	vars: { 
    		a: { id: 'formula-1-1' },
    		b: { id: 'formula-1-2' },
    		c: { id: 'formula-1-3' },
    		d: { id: 'formula-1-total' }
    	}
    });
    var formulaCalc2 = new slikcalc.FormulaCalc({
    	formula: '{a} * {b} = {c}',
    	registerListeners: true,
    	calcOnLoad: true,
    	total: { id: 'formula-2-total' }
    });
    formulaCalc2.addRow({
        vars: {
            a: { id: 'formula-2-1a'},
            b: { id: 'formula-2-1b'},
            c: { id: 'formula-2-1c'}
        }
    });
	formulaCalc2.addRow({
	    vars: {
            a: { id: 'formula-2-2a'},
            b: { id: 'formula-2-2b'},
            c: { id: 'formula-2-2c'}
        },
        checkbox: { id: 'formula-2-2-c' }
    });
    
	new YAHOO.widget.TabView('columnCalcTabs');
	new YAHOO.widget.TabView('formulaCalcTabs');
	new YAHOO.widget.TabView('customCalcTabs');
})();