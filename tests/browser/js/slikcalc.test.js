var Y;

slikcalc.addOnLoad(function() {
	YUI().use('node', 'console', 'test', function (Y2) {

		Y = Y2;
		Y.namespace("slikcalc.tests");

		Y.slikcalc.tests.FormatCurrencyCase = new Y.Test.Case({

			name : 'Format Currency',

			testFormatNull : function() {
				Y.Assert.areEqual(0.00, slikcalc.formatCurrency(null));
			},

			testFormatFloat : function() {
				Y.Assert.areEqual(10.64, slikcalc.formatCurrency(10.64));
			},

			testFormatString : function() {
				Y.Assert.areEqual(75.29, slikcalc.formatCurrency('75.29'));
			},

			testFormatEmptyString : function() {
				Y.Assert.areEqual(0.00, slikcalc.formatCurrency(''));
			},

			testFormatStringWithComma : function() {
				Y.Assert.areEqual(1456.43, slikcalc.formatCurrency('1,456.43'));
			},

			testFormatStringWithDollarSign : function() {
				Y.Assert.areEqual(75.29, slikcalc.formatCurrency('$75.29'));
			}

		});

		Y.slikcalc.tests.ColumnCalcSimpleCase = new Y.Test.Case({

			name: "Simple Column",

			calc: slikcalc.examples.columnCalc.calc,

			tearDown : function() {
				slikcalc.setAmount('ex-1-1', 0.00);
				slikcalc.setAmount('ex-1-2', 0.00);
				slikcalc.get('ex-1-1-c').checked = false;
				slikcalc.get('ex-1-2-c').checked = false;
			},

			testCalcOnLoad : function () {
				Y.Assert.areEqual(5.00, slikcalc.getAmount('ex1-total'), 'Total not set on load');
			},

			testCalculateNotChecked : function () {
				slikcalc.setAmount('ex-1-1', 25.00);
				this.calc.processCalculation();
				Y.Assert.areEqual(5.00, slikcalc.getAmount('ex1-total'), 'Total not updated');
			},

			testCalculateChecked : function() {
				slikcalc.setAmount('ex-1-1', 25.00);
				slikcalc.get('ex-1-1-c').checked = true;
				this.calc.processCalculation();
				Y.Assert.areEqual(30.00, slikcalc.getAmount('ex1-total'), 'Total not updated');
			},

			testCalculateInvertNotChecked : function() {
				slikcalc.get('ex-1-2-c').checked = false;
				slikcalc.setAmount('ex-1-2', 25);
				this.calc.processCalculation();
				Y.Assert.areEqual(30.00, slikcalc.getAmount('ex1-total'), 'Total not updated');
			},

			testCalculateInvertChecked : function() {
				slikcalc.get('ex-1-2-c').checked = true;
				slikcalc.setAmount('ex-1-2', 25);
				this.calc.processCalculation();
				Y.Assert.areEqual(5.00, slikcalc.getAmount('ex1-total'), 'Total not updated');
			}

		});

		Y.slikcalc.tests.ColumnCalcSubtractCase = new Y.Test.Case({

			name: "Subtract Column",

			calc: slikcalc.examples.columnCalcSubtract.calc,

			tearDown : function() {
				slikcalc.setAmount('cc-sub-1', 0.00);
				slikcalc.setAmount('cc-sub-2', 10.00);
				slikcalc.setAmount('cc-sub-3', 0.00);
			},

			testCalcOnLoad : function () {
				Y.Assert.areEqual(-10.00, slikcalc.getAmount('cc-sub-total'), 'Total not set on load');
			},

			testCalculatePositive : function() {
				slikcalc.setAmount('cc-sub-1', 43.16);
				slikcalc.setAmount('cc-sub-3', 8.49);
				this.calc.processCalculation();
				Y.Assert.areEqual(24.67, slikcalc.getAmount('cc-sub-total'), 'Total not set on load');
			},

			testCalculateNegative : function() {
				slikcalc.setAmount('cc-sub-1', 1.00);
				slikcalc.setAmount('cc-sub-3', 5.50);
				this.calc.processCalculation();
				Y.Assert.areEqual(-14.50, slikcalc.getAmount('cc-sub-total'), 'Total not set on load');
			},

			testCalculateEmptyValues : function() {
				slikcalc.setAmount('cc-sub-1', '');
				slikcalc.setAmount('cc-sub-2', '');
				slikcalc.setAmount('cc-sub-3', '');
				this.calc.processCalculation();
				Y.Assert.areEqual(0.00, slikcalc.getAmount('cc-sub-total'), 'Total not set on load');
			}

		});

		Y.slikcalc.tests.FormulaCalcCase = new Y.Test.Case({

			name: "FormulaCalc",

			calc: slikcalc.examples.formulaCalc,

			tearDown : function() {
				slikcalc.setAmount('formula-2', 0.00);
				slikcalc.setValue('formula-3', '');
				slikcalc.setAmount('formula-4', 0.00);
			},

			testCalcOnLoad : function () {
				Y.Assert.areEqual(5.00, slikcalc.getAmount('formula-4'), 'Total not set on load');
			},

			testCalculate : function() {
				slikcalc.setAmount('formula-2', 25.00);
				slikcalc.setAmount('formula-3', 2);
				this.calc.processCalculation();
				Y.Assert.areEqual(60.00, slikcalc.getAmount('formula-4'), 'Total not updated');
			},

			testCalculateDefaultValue : function() {
				slikcalc.setValue('formula-3', '');
				this.calc.processCalculation();
				Y.Assert.areEqual(5.00, slikcalc.getAmount('formula-4'), 'Total not updated');
			}

		});

		Y.slikcalc.tests.FormulaCalcRowsCase = new Y.Test.Case({

			name: "FormulaCalcRows",

			calc: slikcalc.examples.formulaCalcRows,

			tearDown : function() {
				slikcalc.get('formula-rows-1-c').checked = false;
				slikcalc.get('formula-rows-2-c').checked = false;
				slikcalc.setValue('formula-rows-1-2', '');
				slikcalc.setValue('formula-rows-2-2', '');
			},

			testCalculateOneRowChecked : function() {
				slikcalc.get('formula-rows-1-c').checked = true;
				slikcalc.setAmount('formula-rows-1-2', 25.00);
				this.calc.processCalculation();
				Y.Assert.areEqual(30, slikcalc.getAmount('formula-rows-1-4'));
				Y.Assert.areEqual(30, slikcalc.getAmount('formula-rows-total'));
			},

			testCalculateTwoRowsCheck : function() {
				slikcalc.get('formula-rows-1-c').checked = true;
				slikcalc.get('formula-rows-2-c').checked = true;
				slikcalc.setAmount('formula-rows-1-2', 25.75);
				slikcalc.setAmount('formula-rows-2-2', 32.87);
				this.calc.processCalculation();
				Y.Assert.areEqual(30.75, slikcalc.getAmount('formula-rows-1-4'));
				Y.Assert.areEqual(37.87, slikcalc.getAmount('formula-rows-2-4'));
				Y.Assert.areEqual(68.62, slikcalc.getAmount('formula-rows-total'));
			},


			testCalculateOneRowNotChecked: function() {
				slikcalc.get('formula-rows-1-c').checked = false;
				slikcalc.get('formula-rows-2-c').checked = true;
				slikcalc.setAmount('formula-rows-1-2', 25.75);
				slikcalc.setAmount('formula-rows-2-2', 32.87);
				this.calc.processCalculation();
				Y.Assert.areEqual(30.75, slikcalc.getAmount('formula-rows-1-4'));
				Y.Assert.areEqual(37.87, slikcalc.getAmount('formula-rows-2-4'));
				Y.Assert.areEqual(37.87, slikcalc.getAmount('formula-rows-total'));
			},

			testCalculateTwoRowsNotChecked: function() {
				slikcalc.get('formula-rows-1-c').checked = false;
				slikcalc.get('formula-rows-2-c').checked = false;
				slikcalc.setAmount('formula-rows-1-2', 25.75);
				slikcalc.setAmount('formula-rows-2-2', 32.87);
				this.calc.processCalculation();
				Y.Assert.areEqual(30.75, slikcalc.getAmount('formula-rows-1-4'));
				Y.Assert.areEqual(37.87, slikcalc.getAmount('formula-rows-2-4'));
				Y.Assert.areEqual(0.00, slikcalc.getAmount('formula-rows-total'));
			}
		});

		Y.slikcalc.tests.ChainedCalcRowsCase = new Y.Test.Case({

			name: "ChainedCalcs",

			column1: slikcalc.examples.chainedCalcs.columnCalc1,

			column2: slikcalc.examples.chainedCalcs.columnCalc2,

			formula: slikcalc.examples.chainedCalcs.formulaCalc,

			tearDown : function() {
				slikcalc.setValue('chained-1-1', '5.00');
				slikcalc.setValue('chained-1-2', '');
				slikcalc.setValue('chained-2-1', '');
				slikcalc.setValue('chained-2-2', '');
			},

			testCalcOnLoad : function() {
				Y.Assert.areEqual(5.00, slikcalc.getAmount('chained-1-total'));
				Y.Assert.areEqual(5.00, slikcalc.getAmount('chained-3-total'));
			},

			testCalculateChain : function() {
				slikcalc.setAmount('chained-1-1', 25.00);
				slikcalc.setAmount('chained-1-2', 3.28);
				slikcalc.setAmount('chained-2-1', 7.56);
				slikcalc.setAmount('chained-2-2', 21.90);
				this.column1.processCalculation();
				Y.Assert.areEqual(28.28, slikcalc.getAmount('chained-1-total'));
				Y.Assert.areEqual(29.46, slikcalc.getAmount('chained-2-total'));
				Y.Assert.areEqual(57.74, slikcalc.getAmount('chained-3-total'));
			}
		});

		Y.slikcalc.tests.Suite = new Y.Test.Suite("slikcalc suite");
		Y.slikcalc.tests.Suite.add(Y.slikcalc.tests.FormatCurrencyCase);
		Y.slikcalc.tests.Suite.add(Y.slikcalc.tests.ColumnCalcSimpleCase);
		Y.slikcalc.tests.Suite.add(Y.slikcalc.tests.ColumnCalcSubtractCase);
		Y.slikcalc.tests.Suite.add(Y.slikcalc.tests.FormulaCalcCase);
		Y.slikcalc.tests.Suite.add(Y.slikcalc.tests.FormulaCalcRowsCase);
		Y.slikcalc.tests.Suite.add(Y.slikcalc.tests.ChainedCalcRowsCase);

		//create the console
		new Y.Console({
			newestOnTop : false,
			style: 'block'
		}).render('#testLogger');

		Y.Test.Runner.add(Y.slikcalc.tests.Suite);

		//run the tests

		Y.Test.Runner.run();
	});
});
