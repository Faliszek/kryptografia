const prompt = require("prompt");

const alphabet = {
  first: "ABCDEFGHIJKLM".split(""),
  second: "NOPQRSTUVWXYZ".split(""),
};

function getResultOfChar(char) {
  const { first, second } = alphabet;
  if (first.includes(char)) {
    return { which: "second", index: first.findIndex((c) => c === char) };
  }

  if (second.includes(char)) {
    return { which: "first", index: second.findIndex((c) => c === char) };
  }

  return { which: null, index: null };
}

function rot13(message) {
  return message
    .toUpperCase()
    .split("")
    .reduce((acc, char) => {
      const { which, index } = getResultOfChar(char);
      if (which && index) {
        return acc + alphabet[which][index];
      } else {
        return acc + char;
      }
    }, "");
}

prompt.start();

console.log("Wprowadź wiadomość: ");

prompt.get(["message"], function (err, result) {
  if (err) {
    return console.error(err);
  }
  console.log("Wprowadzona wiadomość do zaszyfrowania: " + result.message);
  console.log("Zaszyfrowana wiadomość: ", rot13(result.message));
});
