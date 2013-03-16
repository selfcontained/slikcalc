var slikcalc;
(function () {
	"use strict";

	/**
	 * @class FormulaCalc
	 * @description Calculator object that calculates based on a given formula and mapped variables.  Calculates across multiple rows as well,
	 * updating a single totals value based on a given mathematical operator.
	 * @constructor
	 * @param {Object} config Configuration object, all options of slikcalc.BaseCalc plus the following:
	 * <ul>
	 *	<li>formula : Mathematical formula in string form.  Variables denoted within the '{}' that map to vars definitions passed in on the addRow method.  Example: "{a} + {b} = {c}".  "{a} + {b}" is used as the formula, and {c} becomes the position that the eval'd result is placed into.</li>
	 *	<li>total.vars : Variables configuration object, see slikcalc.FormulaCalc.addRow() for details.  If passed in here, an initial row is added</li>
	 * </ul>
	 */
	slikcalc.FormulaCalc = function (config) {
		this.parent.constructor.call(this, config);
		this.formula = this.config.formula || '';
		this.rows = [];
		this.variables = [];
		if (this.config.vars !== undefined) {
			this.addRow({ vars : this.config.vars });
		}
	};
	slikcalc.extend(slikcalc.FormulaCalc, slikcalc.BaseCalc);

	/**
	 * @description Formula used to calculate the total for a row
	 */
	slikcalc.FormulaCalc.prototype.formula = null;

	/**
	 * @description Holds the formula value once it has been parsed, and the equality portion has been removed
	 */
	slikcalc.FormulaCalc.prototype.formulaParsed = null;

	/**
	 * @description Property to hold the variable from the formula that specifies where the result goes
	 */
	slikcalc.FormulaCalc.prototype.resultVar = null;

	/**
	 * @description Regular Expression to find variables in the formula
	 */
	slikcalc.FormulaCalc.prototype.varMatch = /\{(\w+)\}/gi;

	/**
	 * @description {Array} Array of row objects for the calculator
	 */
	slikcalc.FormulaCalc.prototype.rows = null;

	/**
	 * @description {Array} Array of the variables parsed from the formula
	 */
	slikcalc.FormulaCalc.prototype.variables = null;

	/**
	 * @description Method run on page load to parse the formula, and pull out variables within it.
	 */
	slikcalc.FormulaCalc.prototype.initialize = function () {
		var result,
			formulaSplit;
		this.formulaParsed = this.formula;
		if (this.formulaParsed.indexOf('=') !== -1) {
			formulaSplit = this.formulaParsed.split('=');
			this.formulaParsed = formulaSplit[0];
			this.resultVar = this.varMatch.exec(slikcalc.trim(formulaSplit[1]))[1];
		}
		this.varMatch.lastIndex = 0;
		while ((result = this.varMatch.exec(this.formulaParsed)) !== null) {
			this.variables.push(result[1]);
		}
		this.varMatch.lastIndex = 0;
	};

	/**
	 * @description Adds a row to the calculator to be included in the calculations
	 * @param {Object} rowConfig Configuration object for the row being added to the calculator.  It may contain the following options:
	 * <ul>
	 *  <li>vars : Object containing one to many variable definitions</li>
	 *  <li>vars.x : Configuration object for variable 'x' where x represents a variable in the formula</li>
	 *  <li>vars.x.id : Element id for the input mappted to variable 'x' in formula</li>
	 *  <li>vars.x.defaultValue : (Optional) Value used in place of empty/null for variable 'x'.  Defaults to 0</li>
	 *  <li>checkbox.id : Element id of checkbox. Required if config[checkbox] included</li>
	 *  <li>checkbox.invert : Defaults to false. If true, row is included in total calculcation when un-checked, and omitted when checked</li>
	 * </ul>
	 */
	slikcalc.FormulaCalc.prototype.addRow = function (rowConfig) {
		var idx, vars;
		rowConfig = rowConfig || {};
		vars = rowConfig.vars = rowConfig.vars || {};
		if (rowConfig.checkbox !== undefined) {
			slikcalc.addListener(rowConfig.checkbox.id, 'click', this.processCalculation, this);
			rowConfig.checkbox.invert = rowConfig.checkbox.invert || false;
		}
		for (idx in vars) {
			if (vars.hasOwnProperty(idx)) {
				vars[idx].defaultValue = vars[idx].defaultValue || 0;
				rowConfig.registerListeners = rowConfig.registerListeners === true || (this.registerListeners === true && rowConfig.registerListeners !== false);
				if (rowConfig.registerListeners === true) {
					slikcalc.addListener(vars[idx].id, 'keyup', this.change, this);
					slikcalc.addListener(vars[idx].id, 'change', this.change, this);
				}
			}
		}
		this.rows.push(rowConfig);
	};

	/**
	 * @description Processes the rows and applies the formula to each one.
	 */
	slikcalc.FormulaCalc.prototype.calculate = function () {
		var total = 0.00,
			rows = this.rows,
			idx,
			varIdx,
			includeRow,
			formulaString,
			rowTotal,
			variable,
			variableName,
			variableRegex,
			value;
		for (idx in rows) {
			if (rows.hasOwnProperty(idx)) {
				includeRow = true;
				formulaString = this.formulaParsed;
				rowTotal = 0;
				if (rows[idx].checkbox !== undefined) {
					includeRow = (rows[idx].checkbox.invert !== slikcalc.get(rows[idx].checkbox.id).checked);
				}
				for (varIdx in this.variables) {
					if (this.variables.hasOwnProperty(varIdx)) {
						variableName = this.variables[varIdx];
						variable = rows[idx].vars[variableName];
						value = variable.defaultValue;
						if (slikcalc.get(variable.id) !== null) {
							value = slikcalc.getValue(variable.id);
							value = value === '' ? variable.defaultValue : value;
							value = slikcalc.formatCurrency(value);
						}
						variableRegex = new RegExp("\\{" + variableName + "\\}");
						formulaString = formulaString.replace(variableRegex, value);
					}
				}
				rowTotal = slikcalc.formatCurrency(eval(formulaString));
				if (this.resultVar !== null) {
					slikcalc.setAmount(rows[idx].vars[this.resultVar].id, rowTotal);
				}
				if (includeRow === true && this.totalOperator !== null) {
					total = this.calculateTotal(total, parseFloat(rowTotal));
				}
			}
		}
		if (this.totalId !== null) {
			slikcalc.setAmount(this.totalId, total);
		}
	};

}());
