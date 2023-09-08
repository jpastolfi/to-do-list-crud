import fs from "fs"; // ES6
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

// type for unique id
type UUID = string;

// type for each created task
interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

// function to create a task
function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    // the date is going to be automatically inserted
    date: new Date().toISOString(),
    content,
    // by default, every task inserted has a status of 'incomplete'
    done: false,
  };

  // creates an array of Todo to be saved
  const todos: Array<Todo> = [...read(), todo];

  // saves the array above in the file
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
        dogs: [],
      },
      null,
      2,
    ),
  );
  return todo;
}

// function to read all the tasks
export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  // return either the parsed tasks or an empty object (that would create an error due to JSON trying to parse undefined)
  const db = JSON.parse(dbString || "{}");
  // if there are no tasks, returns an empty array
  if (!db.todos) {
    return [];
  }
  // return the tasks
  return db.todos;
}

// function to update a task. Receives the id (type UUID) of the task to be updated and an object typed as Partial<Todo>, meaning all attributes are optional.
function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
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
function updateContentById(id: UUID, content: string): Todo {
  return update(id, {
    content,
  });
}

// function to delete a task. Receives the id (type UUID) of the task to be deleted
function deleteById(id: UUID) {
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
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
const secondTodo = create("Segunda TODO");
deleteById(secondTodo.id);
const thirdTodo = create("Terceira TODO");
updateContentById(thirdTodo.id, "Atualizada!");
const todos = read();
