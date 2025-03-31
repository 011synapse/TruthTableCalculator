const inputs = document.querySelectorAll(".input-var");
const enter = document.getElementsByClassName("input-enter");
const generate = document.getElementsByClassName("input-generate");
const table = document.getElementsByClassName("truth-table");
const placeholder = document.getElementsByTagName("input");
const videorr = document.getElementsByClassName("video")[0];
const videoavril = document.getElementsByClassName("video")[1];

document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    enter[0].click();
  }
});

let alphabet = ["u", "t", "s", "r", "q", "p"];
const operators = ["∧", "∨", "→", "↔", "⊕"];
const semantic = ["¬", "(", ")"];

let vars = ["p", "q", "r", "s", "t"];

function insert(display, caracter) {
  let cursorPos = display.selectionStart;
  const valorActual = display.value;

  // Construir el nuevo valor
  display.value =
    valorActual.substring(0, cursorPos) +
    caracter +
    valorActual.substring(cursorPos);

  let newCursorPos = cursorPos + 1;

  display.focus();

  display.setSelectionRange(newCursorPos, newCursorPos);
}

inputs.forEach((input) => {
  input.addEventListener("click", () => {
    insert(placeholder[0], input.textContent);
  });
});

function isOperator(value) {
  return operators.includes(value);
}

function isAlphabet(value) {
  return alphabet.includes(value);
}

function cleanNegations(value) {
  const cleanValue = [];
  for (var i = 0; i < value.length; i++) {
    if (value[i] != semantic[0]) {
      cleanValue.push(value[i]);
    }
  }
  return cleanValue.join("");
}

function parseFunction(value, textIndex) {
  console.log("parseFunction: ", value.slice(textIndex), value, textIndex);
  let func = {
    valid: true,
  };

  let expected = ["open", "alphabet", "operator", "alphabet", "close"];
  let expectedIndex = 0;
  while (expected[expectedIndex] !== undefined) {
    // Regla de validacion para caso especial
    if (textIndex == 0 && isAlphabet(value[textIndex]) && value[1]) {
      func.valid = false;
    }
    switch (expected[expectedIndex]) {
      case "open":
        console.log("entering open", value.slice(textIndex), textIndex);
        if (
          value[textIndex] !== "(" &&
          value[textIndex] !== semantic[0] &&
          !alphabet.includes(value[textIndex])
        ) {
          func.valid = false;
          console.log("Expected token: ", expected[expectedIndex]);
        } else if (value[textIndex] == "(") {
          console.log("True token (");
          textIndex++;
        } else {
          if (value[textIndex] == semantic[0]) {
            let aux = parseFunction(value, textIndex + 1);
            func = aux;

            func.value = semantic[0] + aux.value;
            func.cleanValue = cleanNegations(func.value);
            func.negative = aux.negative ? false : true;
            textIndex++;
            console.log("FUNCTION", func);
            return func;
          } else {
            func.value = value[textIndex];
            func.negative = false;
            textIndex++;
            console.log("FUNCTION", func);
            return func;
          }
        }
        break;
      case "alphabet":
        console.log("entering alphabet", value.slice(textIndex), textIndex);
        const auxiliar = parseFunction(value, textIndex);
        console.log("aux finalized");
        if (!auxiliar.valid) {
          func.valid = false;
          console.log("Expected token: ", expected[expectedIndex]);
        } else if (!func.hasOwnProperty("firstValue")) {
          func.firstValue = auxiliar;
          textIndex += auxiliar.value.length;
        } else {
          func.secondValue = auxiliar;
          textIndex += auxiliar.value.length;
        }
        break;
      case "operator":
        console.log("entering operator", value.slice(textIndex), textIndex);
        if (!isOperator(value[textIndex])) {
          func.valid = false;
          console.log("Expected token: ", expected[expectedIndex]);
        } else {
          console.log("True token operator: ", value[textIndex]);
          func.operator = value[textIndex];
          textIndex++;
        }
        break;
      case "close":
        console.log("entering close", value.slice(textIndex), textIndex);
        if (value[textIndex] !== ")") {
          func.valid = false;
          console.log("Expected token: ", expected[expectedIndex]);
        } else {
          console.log("True token close: ", value[textIndex]);
          func.value =
            "(" +
            func.firstValue.value +
            func.operator +
            func.secondValue.value +
            ")";
        }
        break;
    }
    if (!func.valid) break;
    expectedIndex++;
    if (func.hasOwnProperty("index")) {
      break;
    }
  }

  console.log("Function: ", func, func.valid, value);
  return func;
}

function isCalculable(func) {
  return func.value.length == 1 || func?.cleanValue?.length == 1;
}

function operate(first, second, operator, negative) {
  console.log("TO OPERATE", first, second, operator, negative);
  console.log("VARS TO OPERATE", vars);
  if (second == undefined) {
    if (first.negative == true) {
      console.log(
        "RESULT !second first.negative",
        !vars.includes(first.cleanValue)
      );
      if (first?.hasOwnProperty("cleanValue")) {
        return !vars.includes(first.cleanValue);
      }
      return !vars.includes(first.value);
    }
    console.log(
      "RESULT !second ",
      vars.includes(first.value) || vars.includes(first.cleanValue)
    );
    return vars.includes(first.value) || vars.includes(first.cleanValue);
  }
  let result = "";
  switch (operator) {
    case "∧":
      result = first && second;
      break;
    case "∨":
      result = first || second;
      break;
    case "→":
      result = !first || second;
      break;
    case "↔":
      result = first == second;
      break;
    case "⊕":
      result = first != second;
      break;
  }
  if (negative) result = !result;
  console.log("RESULT", result);
  return result;
}

function isFunction(value, i) {
  normal = parseFunction(value, i);
  if (normal.value === undefined || normal.value.length !== value.length) {
    normal.valid = false;
  }
  return normal;
}

function calc(func) {
  // console.log("Calc inputs", func, vars);
  if (!isCalculable(func)) {
    return operate(
      calc(func.firstValue),
      calc(func.secondValue),
      func.operator,
      func.negative
    );
  }
  //console.log("FOUND", func);
  return operate(func);
}

function dtbInt(value) {
  if (value === 0) return "0";
  let binary = [];
  while (value >= 1) {
    binary.push(Math.floor(value % 2));
    Math.trunc((value /= 2));
  }
  binary = binary.join("");
  return binary;
}

function genInteps(value) {
  let alpha = [];
  for (i = 0; i < value?.length; i++) {
    if (isAlphabet(value[i]) && !alpha.includes(value[i])) {
      alpha.push(value[i]);
    }
  }
  alpha = alpha.reverse();
  const arrayLength = Math.pow(2, alpha.length);
  const array = [];
  for (let i = 0; i < arrayLength; i++) {
    let local = [dtbInt(i)];
    local = local.join("");
    array.push(local);
  }

  let ints = [];
  for (let i = 0; i < arrayLength; i++) {
    let aux = [];
    // console.log(array[i]);
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] == 1) {
        aux.push(alpha[j]);
      }
    }
    ints.push(aux);
  }
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].split("");
    ints[i] = ints[i].reverse();
    array[i] = array[i].reverse();

    while (array[i].length != alpha.length) {
      array[i].unshift("0");
    }
  }
  alpha = alpha.reverse();
  return [ints, array, alpha];
}

function resolver(value) {
  // Validation
  let func = isFunction(value, 0);
  console.log("FUNCION FINAL:", func);

  // Validate message
  const fbf = document.getElementsByClassName("fbf");
  if (func.valid) {
    fbf[0].textContent = `f.b.f.`;
    placeholder[0].value = func.value;
  } else {
    fbf[0].textContent = "Invalid function";
    table[0].innerHTML = "";
    return;
  }

  // Resolver
  const inteps = genInteps(func.value)[0];
  const intepRow = genInteps(func.value)[1];
  const alpha = genInteps(func.value)[2];
  table[0].innerHTML = "";
  const headerRow = document.createElement("TR");
  table[0].appendChild(headerRow);
  for (let i = 0; i < alpha.length; i++) {
    const header = document.createElement("TH");
    header.textContent = alpha[i];
    headerRow.appendChild(header);
  }

  for (let i = 0; i < inteps.length; i++) {
    const row = document.createElement("TR");
    for (let j = 0; j < intepRow[i].length; j++) {
      const cell = document.createElement("TD");
      cell.textContent = intepRow[i][j];
      row.appendChild(cell);
    }
    vars = inteps[i];
    const truth = document.createElement("TD");
    const truthValue = calc(func);
    console.log("TRUTH VALUE", truthValue);
    truth.textContent = truthValue;
    row.appendChild(truth);
    table[0].appendChild(row);
  }
  return func.valid;
}

enter[0].addEventListener("click", () => {
  console.clear();
  console.error(videorr, videoavril);
  if (placeholder[0].value == "(p→q)") {
    if (videorr && videorr.paused) {
      videorr.classList.add("visible-video");
      videorr.play();
      videorr.currentTime = 0;
      videorr.addEventListener("ended", () => {
        videorr.classList.remove("visible-video");
        videorr.style.opacity = 0;
        videorr.currentTime = 0;
      });
    }
  }

  if (placeholder[0].value == "avril") {
    console.error("avril");
    if (videoavril && videoavril.paused) {
      console.error("step1");
      videoavril.classList.add("visible-video");
      videoavril.play();
      videoavril.currentTime = 0;
      videoavril.addEventListener("ended", () => {
        videoavril.classList.remove("visible-video");
        videoavril.style.opacity = 0;
        videoavril.currentTime = 0;
      });
    }
  }

  resolver(placeholder[0].value);
});

function gen() {
  const all = alphabet.join("") + operators.join("") + semantic.join("");
  let generated = [];
  do {
    generated = [];
    for (var i = 0; i < Math.random() * 10; i++) {
      generated.push(all[Math.floor(Math.random() * all.length)]);
    }
    generated = generated.join("");
  } while (generated.length >= 5 && resolver(generated) ? false : true);
  return generated;
}

generate[0].addEventListener("click", () => {
  let generations = [];
  generations.push(gen());
  console.clear();
  for (let i = 0; i < generations.length; i++) {
    console.log(generations[i]);
  }
});
