import fs from "fs";
const DB_FILE_PATH = "./core/db";

const create = (content: string): void => {
  fs.writeFileSync(DB_FILE_PATH, content);
};

create("Teste 3");
