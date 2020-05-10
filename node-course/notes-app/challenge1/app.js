const fs = require('fs');

//fs.writeFileSync('challenge1.txt', 'Hello, this is challenge 1.');
fs.appendFileSync('challenge1.txt', "\nThe new line will be appended.");