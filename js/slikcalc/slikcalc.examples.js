slikcalc.examples = {
	
	columnCalc : {},
	formulaCalc : {},
	formulaCalcRows : {},
	
	initialize : function() {
		this.setupColumnCalc();
		this.setupFormulaCalc();
		this.setupFormulaCalcRows();
	},
	
	setupColumnCalc : function() {
		this.columnCalc.calc = new ColumnCalc({
			totalId: 'ex1-total',
			registerListeners: true,
			calcOnLoad: true
		});
		this.columnCalc.calc.addRow({ 
			id: 'ex-1-1',
			checkbox: {
				id: 'ex-1-1-c'
			}
		});
		this.columnCalc.calc.addRow({ 
			id: 'ex-1-2',
			checkbox: {
				id: 'ex-1-2-c',
				invert: true
			}
		});
		this.columnCalc.calc.addRow({ 
			id: 'ex-1-3'
		});
	},
	
	setupFormulaCalc : function() {
		this.formulaCalc = new FormulaCalc({
			formula: '( {a} + {b} ) * {c} = {d}',
			calcOnLoad: true,
            registerListeners: true,
			vars: {
				a: { id: 'formula-1' },
				b: { id: 'formula-2' },
				c: { id: 'formula-3', defaultValue: 1},
				d: { id: 'formula-4'}
			}
		});
	},
	
	setupFormulaCalcRows : function() {
		this.formulaCalcRows = new FormulaCalc({
			formula: '( {a} + {b} ) * {c} = {d}',
			calcOnLoad: true,
			total: { id: 'formula-rows-total' },
            registerListeners: true
		});
		this.formulaCalcRows.addRow({
			vars: {
				a: { id: 'formula-rows-1-1' },
				b: { id: 'formula-rows-1-2' },
				c: { id: 'formula-rows-1-3', defaultValue: 1},
				d: { id: 'formula-rows-1-4'}
			},
			checkbox: {
				id: 'formula-rows-1-c'
			}
		});
		this.formulaCalcRows.addRow({
			vars: {
				a: { id: 'formula-rows-2-1' },
				b: { id: 'formula-rows-2-2' },
				c: { id: 'formula-rows-2-3', defaultValue: 1},
				d: { id: 'formula-rows-2-4'}
			},
			checkbox: {
				id: 'formula-rows-2-c'
			},
            registerListeners: false
		});
	}
};
slikcalc.examples.initialize();