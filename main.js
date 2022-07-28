(function () {
  let data = document.querySelectorAll("[u-name]");

  let _store = {};

  initializeData(data);
  convertStringsToNumbers(_store);

  subscribe(_store, function (name, val) {
    let changedNodes = document.querySelectorAll("[u-name=" + name + "]");

    for (let i = 0; i < changedNodes.length; i++) {
      changedNodes[i].textContent = val;
    }

    let conditionalNodes = document.querySelectorAll("[u-if]");

    for (let i = 0; i < conditionalNodes.length; i++) {
      let expression;

      expression = conditionalNodes[i].getAttribute("u-if");

      let _parsedExp = parseExpression(expression);

      if (eval(_parsedExp)) {
        conditionalNodes[i].style.display = "block";
      } else {
        conditionalNodes[i].style.display = "none";
      }
    }
  });

  function tokenizeExpression(expression) {
    const _operators = [
      ">",
      "<",
      "===",
      "!=",
      ">=",
      "<=",
      "!==",
      "==",
      "&&",
      "||",
    ];

    let _cloneExpression = expression;

    for (let i = 0; i < _operators.length; i++) {
      _cloneExpression = _cloneExpression.replace(_operators[i], "$");
    }

    const tokens = _cloneExpression.split("$");

    const _variables = [];

    for (let i = 0; i < tokens.length; i++) {
      let trimmed = tokens[i].trim();

      if (isNaN(trimmed)) {
        _variables.push(trimmed);
      }
    }

    return _variables;
  }

  function parseExpression(expression) {
    let _parsedExpression = expression;
    let _variables = tokenizeExpression(expression);

    for (let i = 0; i < _variables.length; i++) {
      if (_store[_variables[i]] === undefined) {
        throw new ReferenceError(_variables[i] + " is not defined");
      }

      _parsedExpression = _parsedExpression.replace(
        _variables[i],
        _store[_variables[i]]
      );
    }

    return _parsedExpression;
  }

  function initializeData(data) {
    if (!data.length) {
      return;
    }

    for (let i = 0; i < data.length; i++) {
      let dataName = data[i].getAttribute("u-name");

      let dataValue = data[i].textContent;
      _store[dataName] = dataValue;
    }
  }

  function convertStringsToNumbers(data) {
    for (let i in data) {
      if (!isNaN(data[i])) {
        data[i] = +data[i];
      }
    }
  }

  function subscribe(obj, callback) {
    for (let i in obj) {
      let val = obj[i];

      Object.defineProperty(obj, i, {
        get() {
          return val;
        },
        set(newVal) {
          val = newVal;
          callback.call(_store, i, val);
        },
      });
    }
  }

  main.call(_store);
})();
