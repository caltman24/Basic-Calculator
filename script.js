import { qs, qsa } from "./Utils/domUtils.js";

class Calculator {
  constructor(previousOpernadElement, currentOperandElement) {
    this.previousOpernadElement = previousOpernadElement;
    this.currentOperandElement = currentOperandElement;
    // Clear calculator on new reference
    this.clear();
  }

  // set both operands to an empty string and set the operator to undefined
  clear() {
    this.previousOperand = "";
    this.currentOperand = "";
    this.operator = undefined;
  }

  chooseOperation(operation) {
    //  if there is already a previous and current operand with given operator then
    //  calculate and set the calculator's operator to the selected operation
    if (
      this.previousOperand !== "" &&
      this.operator !== undefined &&
      this.currentOperand !== ""
    ) {
      this.calculate();
      this.operator = operation;
    } else {
      // check if both operands are empty then return (if user selects an operator with no operand)
      if (this.previousOperand === "" && this.currentOperand === "") return;

      // if the calculator's operator is not undefined then set it equal to the selected operation and return
      // (if the user selects a different operator consecutivly)
      if (this.operator !== undefined) {
        this.operator = operation;
        return;
      }

      /* 
        if the other two conditions don't check, then set the calculator's operator to
        the selected operation and check if previousOperand has content then calculate 
      */
      this.operator = operation;
      if (this.previousOperand !== "") {
        this.calculate();
      }
    }
    // finally then set previousOperand equal to currentOperand then empty currentOperand
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  calculate() {
    // check if previousOperand isnt empty and current is empty then return
    if (this.previousOperand !== "" && this.currentOperand === "") return;

    let calculation;
    let previous = parseFloat(this.previousOperand.replace(/,/g, ""));
    let current = parseFloat(this.currentOperand.replace(/,/g, ""));
    switch (this.operator) {
      case "+":
        calculation = previous + current;
        break;
      case "-":
        calculation = previous - current;
        break;
      case "×":
        calculation = previous * current;
        break;
      case "÷":
        calculation = previous / current;
        break;
      default:
        return;
    }
    if (calculation > 99999999999) {
      calculation = calculation.toExponential(4);
    }
    calculation = calculation.toLocaleString("en", {
      maximumFractionDigits: 5,
    });
    console.log(calculation);

    this.currentOperand = calculation;
    // empty previousOperand after calculation
    this.previousOperand = "";
    // reset operation after calculation
    this.operator = undefined;
    // if current operand length is 9 digits or more than apply shrink class (font-size: 60%)
    if (this.currentOperand.length >= 9) {
      this.currentOperandElement.classList.add("shrink-70");
    }
  }

  appendNumber(number) {
    // return if current operand already contains a decimal
    if (number === "." && this.currentOperand.includes(".")) return;
    // check if calculator's current operand's length is 9 or more digits than return
    if (this.currentOperandElement.innerText.length >= 11) return;
    // append number to current operand string
    this.currentOperand = this.currentOperand.toString() + number.toString();
    // check if current operand starts with a deciaml and prepend a 0;
    if (this.currentOperand.startsWith(".")) {
      this.currentOperand = "0" + this.currentOperand;
    }
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.currentOperand;
    // if the calculator's operator is defined, then show previousOperand display string else empty
    if (this.operator !== undefined) {
      this.previousOpernadElement.innerText = `${this.previousOperand} ${this.operator}`;
    } else {
      this.previousOpernadElement.innerText = "";
    }
  }
}

const operatorButtons = qsa(".operator");
const numberButtons = qsa(".number");
const clearButton = qs(".clear");
const equalButton = qs(".equal");
const previousOpernadElement = qs(".previous-operand");
const currentOperandElement = qs(".current-operand");

// calculator instance
const calculator = new Calculator(
  previousOpernadElement,
  currentOperandElement
);

// number buttons event listeners
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

// operator button event listeners
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

// equal button event listener
equalButton.addEventListener("click", () => {
  calculator.calculate();
  calculator.updateDisplay();
});

// clear button event listener
clearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});
