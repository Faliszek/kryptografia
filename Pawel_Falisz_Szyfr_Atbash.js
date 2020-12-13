const prompt = require("prompt");

const atbash = (message) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const alphabetBackwards = "zyxwvutsrqponmlkjihgfedcba".split("");

  return message.split("").reduce((acc, char) => {
    const index = alphabet.findIndex((c) => c === char);
    return acc + alphabetBackwards[index];
  }, "");
};

prompt.start();

console.log("Wprowadź wiadomość: ");

prompt.get(["message"], function (err, result) {
  if (err) {
    return console.error(err);
  }
  console.log("Wprowadzona wiadomość do zaszyfrowania: " + result.message);
  console.log("Zaszyfrowana wiadomość: ", atbash(result.message));
});
