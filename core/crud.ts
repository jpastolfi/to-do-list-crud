import fs from "fs";
const DB_FILE_PATH = './core/db';

console.log('[CRUD]');

const createContent = (content: string) => {
  // Salvar o content no sistema
  fs.writeFileSync(DB_FILE_PATH, content);
  return content;
}

// SIMULATION

console.log(createContent('Hoje eu preciso gravar aulas!'));