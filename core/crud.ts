import fs from "fs"; // ES6
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

// type for unique id
type UUID = string;

// type for each created task
interface Task {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

// function to create a task
export function create(content: string): Task {
  const task: Task = {
    id: uuid(),
    // the date is going to be automatically inserted
    date: new Date().toISOString(),
    content,
    // by default, every task inserted has a status of 'incomplete'
    done: false,
  };

  // creates an array of Task to be saved
  const tasks: Array<Task> = [...read(), task];

  // saves the array above in the file
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        tasks,
        dogs: [],
      },
      null,
      2,
    ),
  );
  return task;
}

// function to read all the tasks
export function read(): Array<Task> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  // return either the parsed tasks or an empty object (that would create an error due to JSON trying to parse undefined)
  const db = JSON.parse(dbString || "{}");
  // if there are no tasks, returns an empty array
  if (!db.tasks) {
    return [];
  }
  // return the tasks
  return db.tasks;
}

// function to update a task. Receives the id (type UUID) of the task to be updated and an object typed as Partial<Task>, meaning all attributes are optional.
export function update(id: UUID, partialTodo: Partial<Task>): Task {
  let updatedTodo;
  const tasks = read();
  tasks.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        tasks,
      },
      null,
      2,
    ),
  );

  if (!updatedTodo) {
    throw new Error("Please, provide another ID!");
  }

  return updatedTodo;
}

// function to update the content of a task. Receives the id (type UUID) of the task to be updated and a string, which is going to be the new content of the task
function updateContentById(id: UUID, content: string): Task {
  return update(id, {
    content,
  });
}

// function to delete a task. Receives the id (type UUID) of the task to be deleted
export function deleteById(id: UUID) {
  const tasks = read();

  const todosWithoutOne = tasks.filter((task) => {
    if (id === task.id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        tasks: todosWithoutOne,
      },
      null,
      2,
    ),
  );
}

// function to clear the entire database of tasks. Effectively it just writes an empty string in the database file
function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
CLEAR_DB();
create("Primeira TODO");
create("Segunda TODO");
create("Terceira TODO");
create("Quarta TODO");
create("Quinta TODO");
