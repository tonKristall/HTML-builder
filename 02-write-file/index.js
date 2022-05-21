const fs = require('fs');
const process = require('process');
const path = require('path');
const readline = require('readline');

const HELLO = 'Введите сообщение: ';
const GOOD_BYE = 'До свидания!!!';
const EXIT_COMMAND = 'exit';
const INIT_TEXT_FILE = '';
const FILE_NAME = 'text.txt';

const pathFile = path.join(__dirname, FILE_NAME);
const newLineChar = process.platform === 'win32' ? '\r\n' : '\n';

fs.promises.writeFile(pathFile, INIT_TEXT_FILE).then(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const question = () => {
    rl.question(HELLO, (message) => {
      if (message === EXIT_COMMAND) {
        process.exit();
      }
      fs.promises.appendFile(pathFile, `${message}${newLineChar}`);
      question(message);
    });
  };
  process.on('exit', () => {
    console.log(GOOD_BYE);
  });
  question();
});
