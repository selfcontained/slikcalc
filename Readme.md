[![Build Status](https://secure.travis-ci.org/selfcontained/slikcalc.png?branch=master)](http://travis-ci.org/selfcontained/slikcalc)

slikcalc
===

Slikcalc is a small javascript framework that makes it easy to add dynamic and static mathematical calculations to your html pages.


##Setup

Setting up Slikcalc is super simple, just [download the latest release](https://github.com/selfcontained/slikcalc/tags), and then include slikcalc.min.js on your page.

```html
<script src="/slikcalc.min.js" type="text/javascript"></script>
```

After that, you're ready to begin with either a ColumnCalc or FormulaCalc, or if you're feeling really smart, a Custom calculator.

---

###Column Calculations

Column calculators are for when you have a collection of values that you want to apply a mathematical computation to, such as summing them, or multiplying them together. Usage includes creating a new ColumnCalc object, which can take configuration options, and then call the addRow() method for each value you want to add, which can also take configuration options. The total of the calculation is inserted into the field identified by one of the options passed into the constructors configuration.

###ColumnCalc Example

```javascript
var columnCalc1 = slikcalc.create('column', {
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
```

###ColumnCalc Options

```javascript
var columnCalc1 = slikcalc.create('column', {
	total: {
		id: 'totalElementId', //Optional.  Id of the element where the total calculation of a collection of rows will go.
		operator: '+', //Optional, defaults to '+'. Valid values = ( +, -, *, x, / ).  Mathematical operator used to calculate the total of a collection of rows.
	},
	registerListeners: true/false, //Optional, defaults to false.  If true, keyup event listeners will be attached to inputs that will trigger the calculate method.
	calcOnLoad: true/false //Optional, defaults to false. Causes calculator to perform its calculate function on the page load event
});
```

---

###Formula Calculations

Formula calcs are more flexible than the Column calcs, and can be used in a few different ways. The concept behind them is that you define a formula as a string, and then plug in different input fields to match up to the variables in your formula.
For example, at the top of this page are two formula calcs, where one is a formula of ```( a / b ) + c = d```. Each of the inputs is mapped to one of the variables through configuration. One slight variation when passing in the formula strings in the constructor, is you have to wrap your variables in curly braces {}. So the previous formula would look like:
```( {a} / {b} ) + {c} = {d}```.

Formula calcs can be configured as one set of inputs mapped to the formula, or as a collection of inputs each mapped to the same formula. This is useful if you have a table with multiple rows that each need to calculate the same formula. In this case you can simply pass the configuration for each row, and optionally, an input to store the total of each row of formulas into. This total can be a sum of the formula calculations, or any of the other supported operators ```+ - x * /```. Note that __x__ and __*__ both multiply the values, but are both included for convenience.

###FormulaCalc Example

```javascript
var formulaCalc1 = slikcalc.create('formula', {
	formula: '( {a} / {b} ) + {c} = {d}',
	registerListeners: true,
	calcOnLoad: true,
	vars: {
		a: { id: 'formula-1-1' },
		b: { id: 'formula-1-2', defaultValue: 1 },
		c: { id: 'formula-1-3' },
		d: { id: 'formula-1-total' }
	}
});
```

###FormulaCalc Options

```javascript
var formulaCalc = slikcalc.create('formula', {
	formula: '{a} + {b} = {c}', //Required formula string
	calcOnLoad: true/false, //Optional, defaults to false. Causes calculator to perform its calculate function on the page load event
	total: {
		id: 'totalElementId', //Optional.  Id of the element where the total calculation of a collection of rows will go.
		operator: '+', //Optional, defaults to '+'. Valid values = ( +, -, *, x, / ).  Mathematical operator used to calculate the total of a collection of rows.
	},
	registerListeners: true/false, //Optional, defaults to false.  If true, keyup event listeners will be attached to inputs that will trigger the calculate method.
	vars: {
		a: {
			id: 'first-value', //This would map the input 'header-2-1' to the variable {a} in the formula string
			defaultValue: 0 //Optional, default is 0. This value is used if there is no value in the mapped input
		 },
		b: { id: 'second-value' }, //This would map the input 'header-2-2' to the variable {b} in the formula string
		c: { id: 'row-total'} //This would map the input 'header-2-3' to the variable {c} in the formula string
	}  //Optional.  If a 'vars' configuration is passed in the constructor, it is treated as if you called addRow and passed it in.  This is for convenience when you have only one set of inputs for you calculation.
});
```

---

###Chaining Calculators

Sometimes you may have a collection of calculators that must fire in a particular order for everything to calculate correctly. Slikcalc takes this into consideration and provides a very simple interface for controlling this. This is handled with two methods, ```triggers()``` and ```dependsOn()```. If we have a "calculateOne" calc object that should trigger the calculation of "calculatorTwo" object, we can set this up as follows:

```javascript
calculatorOne.triggers(calculatorTwo);
```

This same behavior can be created by describing it in reverse using the dependsOn() method

```javascript
calculatorTwo.dependsOn(calculatorOne);
```


This allows you to write your calculator objects in small, contained objects, and then chain them together as needed due to a fluent interface.  For example, if we have three calculator objects, calc1, calc2, an calc3, and they need to fire eachother in that order, we can accomplish this as follows:

```javascript
calc1.triggers(calc2).triggers(calc3);
```

###Custom Calculations

Custom calculators are exactly what they sound like, completely custom, and they can do anything you want them to. All that is required is that you create your own class, extend slikcalc.BaseCalc using slikcalc.extend(), and then implement a calculate method in your class. The rest is up to you! I'll post some examples of custom calculators soon.

```javascript
slikcalc.MyCustomCalc = function (config) {
	this.parent.constructor.call(this, config);
};
slikcalc.extend(slikcalc.MyCustomCalc, slikcalc.BaseCalc);
slikcalc.MyCustomCalc.prototype.calculate = function() {
	//your code here
};
```
