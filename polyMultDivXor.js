//Convenient function for padding start of binary string
const padStartZero = (string, field) => {
  return string.padStart(field.length, '0');
};

const xorFunct = (argOne, argTwo) => {
  let tempArgOne = argOne;
  let tempArgTwo = argTwo;
  let lenDiff = argOne.length - argTwo.length;

  //Either value can be any length
  if (lenDiff > 0) {
    tempArgTwo = argTwo.padStart(argOne.length, '0');
  } else if (lenDiff < 0) {
    tempArgOne = argOne.padStart(argTwo.length, '0');
  }
  //XOR the values
  let xorFunctOut = '';
  for (let i = 0; i < argOne.length; i++) {
    tempArgOne[i] !== tempArgTwo[i]
      ? (xorFunctOut += '1')
      : (xorFunctOut += '0');
  }
  //Return the result
  return xorFunctOut;
};

const binMult = (a, b, fieldBin) => {
  let outputBin;
  let tempFieldBin = fieldBin;
  //Make sure values are within field
  if (
    parseInt(a, 2) >= parseInt(fieldBin, 2) ||
    parseInt(b, 2) >= parseInt(fieldBin, 2)
  ) {
    throw 'Error: Both parameter values must be less than the finite field';
  }
  //Pad both values with 0s, makes for consistant behaviour
  a = padStartZero(a, fieldBin);
  b = padStartZero(b, fieldBin);
  let xorOut = ''; //Binary multiplication in finite field
  for (let i = b.length - 1; i >= 0; i--) {
    if (b[i] === '1') {
      xorOut = xorFunct(
        a.padEnd(a.length + (a.length - 1 - i), '0'),
        xorOut
      );
    }
  }
  let i = 0;
  let xorOutRelevant;
  do {
    //Reduction
    xorOutRelevant = xorOut.substring(
      xorOut.indexOf('1'),
      xorOut.length
    );
    tempFieldBin = fieldBin.padEnd(xorOutRelevant.length, '0');
    xorOut = xorFunct(xorOutRelevant, tempFieldBin);
    i++;
  } while (
    //Change this term '(parseInt(fieldBin,2)/2)' to return pure output and not output % field
    parseInt(xorOut, 2) >= parseInt(fieldBin, 2) &&
    i <= 20
  );

  outputBin = xorOut.substring(xorOut.indexOf(1), xorOut.length);

  if (outputBin.length < fieldBin.length) {
    //Pad start with 0s
    let temp = outputBin.padStart(fieldBin.length, '0');
    outputBin = temp;
  }
  //Return finite field multiplication output
  return outputBin;
};

const binDiv = (a, b, fieldBin) => {
  let invB = '';
  let decLim = parseInt(fieldBin, 2);
  //Loop the entire field or max 9999 times
  for (let i = 1; i < decLim && i < 9999; i++) {
    let binInc = padStartZero(i.toString(2), fieldBin);
    //Invert b (second argument)
    let temp = binMult(b, binInc, fieldBin);
    if (parseInt(temp, 2) === 1 || parseInt(temp, 2) === decLim - 1) {
      invB = binInc;
      break;
    }
  }
  //Pad inverse
  invB = padStartZero(invB, fieldBin);
  //Return multiplication (a * b^-1) if inverse is found
  return invB.includes('1')
    ? binMult(a, invB, fieldBin)
    : 'Error: No inverse found for second argument';
};
console.log('\n----------------------------------------------------');

try {
  let arg1 = prompt('Enter first value (binary...e.g 1101):\n');
  let arg2 = prompt('Enter second value (binary)...eg 0011:\n');
  let argField = prompt('Enter field (binary)...eg 10011:\n');
  let divOrMult = prompt(
    'Enter * for multiplication, / for division:\n'
  );

  if (divOrMult.indexOf('*') >= 0) {
    console.log(`Output: ${binMult(arg1, arg2, argField)}`);
  } else if (divOrMult.indexOf('/') >= 0) {
    console.log(`Output: ${binDiv(arg1, arg2, argField)}`);
  }
} catch (e) {
  console.error(e);
}
