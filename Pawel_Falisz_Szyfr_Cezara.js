const prompt = require("prompt");

const alphabet = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ".split("");
const shift = 2;

function encrypt(message) {
  const startOfArray = alphabet.slice(0, shift + 1);
  const endOfArray = alphabet.slice(shift + 1, alphabet.length);

  const newAlphabet = endOfArray.concat(startOfArray);

  return message.split("").reduce((acc, sign) => {
    const char = sign.toUpperCase();

    if (!Number.isNaN(Number(char))) return acc + char;

    if (alphabet.includes(char)) {
      const index = alphabet.findIndex((c) => c === char);

      return acc + newAlphabet[index];
    }

    return acc + char;
  }, "");
}

prompt.start();

console.log("Wprowadź wiadomość: ");

prompt.get(["message"], function (err, result) {
  if (err) {
    return console.error(err);
  }
  console.log("Wprowadzona wiadomość do zaszyfrowania: " + result.message);
  console.log("Zaszyfrowana wiadomość: ", encrypt(result.message));
});
