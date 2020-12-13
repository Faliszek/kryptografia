/* Elektryczny telegraf
mostekwheatstoneax
Stereoskop zwierciadlany

BCACXOXZFSTVBCAMOEEY​
GROYACVJFBYOKTMFET​
OYMXAROZPQUYMDXEGDBUFGTY

hasło-klucz: KLUCZ */

const prompt = require("prompt");

//usuwamy duplikujace sie znaki z klucza
//jak rowniez z alfabetu probojac pozbyc sie litery I
function removeDuplicate(key) {
  const set = new Set(key.split(""));
  return [...set].join("");
}

const KLUCZ = "KLUCZ";
const ALPHABET = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

function parseKey(key) {
  return removeDuplicate(key).toUpperCase();
}

//mozemy zbudowac 1 lub 2 wymiarowa tablice
//2 wymiarowa bedzie namm sluzyla raczej jako pomoc do wizualizowania i debugowania
function buildTable(key, dimension = 1) {
  const keyAsList = key.split("");
  const alphabet = removeDuplicate(ALPHABET.replace("I", "J")).split("");

  const alphabetWithoutKey = alphabet.filter(
    (char) => !keyAsList.includes(char)
  );

  const { table } = keyAsList.concat(alphabetWithoutKey).reduce(
    ({ row, table }, el, index) => {
      if (index % 5 === 0 && index !== 0) {
        return { row: [el], table };
      } else {
        const newRow = row.concat(el);
        const arrayOrEl = dimension === 1 ? newRow : [newRow];

        return {
          row: newRow.length === 5 ? [] : newRow,
          table: newRow.length === 5 ? table.concat(arrayOrEl) : table,
        };
      }
    },
    { row: [], table: [] }
  );

  return table;
}

//Dodajemy x do stringa
//tylko wtedy kiedy jestesmy w trybie szfyrowania
// LUB jest nieparzysty

function clean(m, type) {
  if (m.length % 2 === 0 || type === "d") {
    return m;
  }

  return `${m}X`;
}

//in ['E', 'L', 'E', 'K']
//out  ['EL', 'EK']
function splitMessageToPairs(message, type) {
  // usuwamy niepotrzebne spacje
  // zamieniamy i na j
  // usuwammy spacje wewnatrz
  // uppecase
  const removeWhitespace = message
    .trim()
    .replace(/i/g, "j")
    .replace(/\s/g, "")
    .toUpperCase();

  //jesli ilosc znakow jest nieparzysta
  //oraz jestesmmy w trybie encrypt dodajemy X
  const messageWithEvenLength = clean(removeWhitespace, type);
  //string do listy i tworzymy 2 wymiarowa tablice
  //kazdy element posiada 2 chary
  const { message: splittedMessage } = messageWithEvenLength.split("").reduce(
    (acc, char, index) => {
      //iterujemy po kazdym elemencie, co drugi element grupujemy w nowa tablice
      if (index % 2 !== 0 && index !== 0) {
        return { prev: "", message: acc.message.concat(acc.prev + char) };
      }
      return { prev: char, message: acc.message };
    },
    { prev: "", message: [] }
  );

  return splittedMessage;
}

//dla x,y podaje index w tablicy
function getIndex(x, y) {
  const row = y !== 0 ? y * 5 : y;
  return row + x;
}

// przesuwanie indexow w tablicy, jesli wynik przesuniecia wychodzi poza tabele
// normalnie musielibsymy odpwiednio wartosci wyliczac
// jednak ten algorytm zawsze przesuwa o 1, przez co
//takie podstawienie jest bezpieczne
function moveTo(value) {
  if (value === -1) return 4;
  if (value === 5) return 0;
  return value;
}

//klucz, wiadomosc, i typ e(encrypt) - szyfrowanie, d - deszyfrowanie
function playfair(keyArg, messageArg, type = "e") {
  const key = parseKey(keyArg);
  const message = splitMessageToPairs(messageArg, type);
  const table = buildTable(key, 1);

  //lazy evaluation - zwracamy funckje, ktora wykonamy dopiero po
  //zaplikowaniu argumentu
  const move = (v) => (type === "e" ? moveTo(v + 1) : moveTo(v - 1));

  // console.log(buildTable(key, 2));
  return message.reduce((acc, [first, second]) => {
    const firstSign = first;
    const secondSign = first === second ? "X" : second;
    const firstLetterIndex = table.findIndex((char) => char === firstSign);
    const secondLetterIndex = table.findIndex((char) => char === secondSign);

    //wspolrzednie elementow w tablicy
    // [ 'K', 'L', 'U', 'C', 'Z' ],
    // [ 'A', 'B', 'D', 'E', 'F' ],
    // [ 'G', 'H', 'J', 'M', 'N' ],
    // [ 'O', 'P', 'Q', 'R', 'S' ],
    // [ 'T', 'V', 'W', 'X', 'Y' ]
    // punkty startowe 0,0, co oznacza ze:
    //  np 0,0 -> K
    //     1,1 -> B itd.
    const [x1, y1] = [firstLetterIndex % 5, Math.floor(firstLetterIndex / 5)];
    const [x2, y2] = [secondLetterIndex % 5, Math.floor(secondLetterIndex / 5)];

    let encryptedFirst = "";
    let encryptedSecond = "";

    //ten sam wiersz
    if (y1 === y2) {
      encryptedFirst = table[getIndex(move(x1), y1)];
      encryptedSecond = table[getIndex(move(x2), y2)];
    }

    //ta sama kolumna
    else if (x1 === x2) {
      encryptedFirst = table[getIndex(x1, move(y1))];
      encryptedSecond = table[getIndex(x2, move(y2))];
    } else {
      //przeciwne strony
      encryptedFirst = table[getIndex(x2, y1)];
      encryptedSecond = table[getIndex(x1, y2)];
    }

    // console.log(firstSign, firstLetterIndex, [x1, y1]);
    // console.log(secondSign, secondLetterIndex, [x2, y2]);
    // console.log(encryptedFirst, encryptedSecond);
    // console.log("-----------------------------------");

    return acc + encryptedFirst + encryptedSecond;
  }, "");
}

prompt.start();

console.log("e - encrypt, d - decrypt");

prompt.get(["type", "message"], function (err, result) {
  if (err) {
    return console.error(err);
  }

  if (result.type === "e") {
    console.log("Wprowadzona wiadomość do zaszyfrowania: " + result.message);
    console.log(
      "Zaszyfrowana wiadomość: ",
      playfair(KLUCZ, result.message, "e")
    );
  }

  if (result.type === "d") {
    console.log("Wprowadzona wiadomość do zdeszyfrowania: " + result.message);
    console.log(
      "Zdeszyfrowana wiadomość: ",
      playfair(KLUCZ, result.message, "d")
    );
  }

  if (result.type !== "d" && result.type !== "e") {
    console.log("Error");
  }
});

// ------TESTS---------

// function test(func, expected) {
//   const result = func();
//   console.log("\n");
//   if (expected.localeCompare(result) === 0) {
//     console.log("✅ Should display correct value");
//   } else {
//     console.log(`❌ Failed\n`);
//     console.log(`Should be \t${expected}\nbut found \t${result}​`);
//   }
// }

// ENCRYPT;
// test(
//   () => playfair(KLUCZ, "Elektryczny telegraf", "e"),
//   "BCACXOXZFSTVBCAMOEEY​"
// );
// test(
//   () => playfair(KLUCZ, "Stereoskop zwierciadlany", "e"),
//   "OYMXAROZPQUYMDXEGDBUFGTY"
// );

//DECRYPT

// test(
//   () => playfair(KLUCZ, "BCACXOXZFSTVBCAMOEEY​", "d"),
//   "ELEKTRYCZNYTELEGRAFX"
// );
// test(
//   () => playfair(KLUCZ, "OYMXAROZPQUYMDXEGDBUFGTY", "d"),
//   "STEREOSKOPZWJERCJADLANYX"
// );

/*
 */
