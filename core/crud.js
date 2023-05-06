const fs = require('fs');
const DB_FILE_PATH = './core/db';

console.log('[CRUD]');

const createContent = (content) => {
  // Salvar o content no sistema
  fs.writeFileSync(DB_FILE_PATH, content);
  return content;
}

// SIMULATION

console.log(createContent('Hoje eu preciso gravar aulas!'));