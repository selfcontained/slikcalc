slikcalc.examples = {
	
	columnCalc : {},
	columnCalcSubtract : {},
	formulaCalc : {},
	formulaCalcRows : {},
	
	chainedCalcs : {},
	
	initialize : function() {
		this.setupColumnCalc();
		this.setupColumnCalcSubtract();
		this.setupFormulaCalc();
		this.setupFormulaCalcRows();
		this.setupChainedCalcs();
	},
	
	setupColumnCalc : function() {
		this.columnCalc.calc = new slikcalc.ColumnCalc({
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
	
	setupColumnCalcSubtract : function() {
		this.columnCalcSubtract.calc = new slikcalc.ColumnCalc({
			totalId: 'cc-sub-total',
			registerListeners: true,
			calcOnLoad: true,
			totalOperator: '-'
		});
		this.columnCalcSubtract.calc.addRow({ id: 'cc-sub-1' });
		this.columnCalcSubtract.calc.addRow({ id: 'cc-sub-2' });
		this.columnCalcSubtract.calc.addRow({ id: 'cc-sub-3' });
	},
	
	setupFormulaCalc : function() {
		this.formulaCalc = new slikcalc.FormulaCalc({
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
		this.formulaCalcRows = new slikcalc.FormulaCalc({
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
	},
	
	setupChainedCalcs : function() {
		this.chainedCalcs.columnCalc1 = new slikcalc.ColumnCalc({
			totalId: 'chained-1-total',
			registerListeners: true,
			calcOnLoad: true
		});
		this.chainedCalcs.columnCalc1.addRow({ id: 'chained-1-1' });
		this.chainedCalcs.columnCalc1.addRow({ id: 'chained-1-2' });
		this.chainedCalcs.columnCalc2 = new slikcalc.ColumnCalc({
			totalId: 'chained-2-total',
			registerListeners: true
		});
		this.chainedCalcs.columnCalc2.addRow({ id: 'chained-2-1' });
		this.chainedCalcs.columnCalc2.addRow({ id: 'chained-2-2' });
		this.chainedCalcs.formulaCalc = new slikcalc.FormulaCalc({
			formula: '{a} + {b} = {c}',
			vars: {
				a: { id: 'chained-1-total' },
				b: { id: 'chained-2-total' },
				c: { id: 'chained-3-total' }
			}
		});
		this.chainedCalcs.columnCalc1.triggers(this.chainedCalcs.columnCalc2).triggers(this.chainedCalcs.formulaCalc);
	}
};
slikcalc.examples.initialize();
