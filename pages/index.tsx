import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { taskController } from "@ui/controller/task";
const bg = "/bg.jpeg";
interface HomeTask {
  id: string;
  content: string;
  done: boolean;
}

export default function HomePage() {
  // State for the total amount of pages (tasks / tasks.length)
  const [totalPages, setTotalPages] = useState(0);
  // State for the current page
  const [page, setPage] = useState(1);
  // State for all the tasks
  const [tasks, setTasks] = useState<HomeTask[]>([]);
  // If the total number of pages is higher than the current page, there are more pages to show
  const hasMorePages = totalPages > page;
  // Ref to check if it's the first time loading the page and avoid loading the tasks more than once on the first load
  const initialLoadComplete = useRef(false);
  // State to check if the application has finished loading
  const [isLoading, setIsLoading] = useState(true);
  // State for filtering the tasks
  const [searchTerm, setSearchTerm] = useState("");
  const currentTasks = taskController.filterTasksByContent<HomeTask>(
    searchTerm,
    tasks,
  );
  // Boolean to check if there are any tasks in the task list after loading is complete. Used to enable the 'No items found' section
  const hasNoTasks = currentTasks.length === 0 && !isLoading;
  // State for the content of a new task
  const [newTaskContent, setNewTaskContent] = useState("");

  useEffect(() => {
    if (!initialLoadComplete.current) {
      taskController
        .get({ page })
        .then(({ tasks, pages }) => {
          setTasks(tasks);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, [page]);

  return (
    <main>
      {/* Inside the GlobalStyles component, you can select the themeName you want for the page. */}
      <GlobalStyles themeName="coolGrey" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            taskController.create({
              content: newTaskContent,
              onError() {
                alert("You need to have a content to create a new task");
              },
              onSuccess(task: HomeTask) {
                setTasks((oldTasks) => {
                  return [task, ...oldTasks];
                });
                setNewTaskContent("");
              },
            });
          }}
        >
          <input
            type="text"
            placeholder="Correr, Estudar..."
            value={newTaskContent}
            onChange={(event) => {
              setNewTaskContent(event.target.value);
            }}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function filterTasks(event) {
              setSearchTerm(event.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {currentTasks.map(({ id, content, done }) => (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={function handleToggle() {
                      taskController.toggleDone({
                        id,
                        onError() {
                          alert("Failed to update task");
                        },
                        updateTasksOnScreen() {
                          setTasks((currentTasks) => {
                            return currentTasks.map((task) => {
                              if (task.id === id) {
                                return {
                                  ...task,
                                  done: !task.done,
                                };
                              }
                              return task;
                            });
                          });
                        },
                      });
                    }}
                  />
                </td>
                <td>{id.substring(0, 4)}</td>
                <td>{!done ? content : <s>{content}</s>}</td>
                <td align="right">
                  <button
                    data-type="delete"
                    onClick={() => {
                      taskController
                        .deleteById(id)
                        .then(() => {
                          setTasks((currentTasks) =>
                            currentTasks.filter(
                              (currentTask) => currentTask.id !== id,
                            ),
                          );
                        })
                        .catch(() => {
                          console.error("Erro");
                        });
                    }}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}
            {/* Shows a message saying `No items found` if there are no task in the task list */}
            {hasNoTasks && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}
            {hasMorePages && currentTasks.length > 0 && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);
                      taskController
                        .get({ page: nextPage })
                        .then(({ tasks, pages }) => {
                          setTasks((oldTasks) => {
                            return [...oldTasks, ...tasks];
                          });
                          setTotalPages(pages);
                        });
                      setIsLoading(false);
                    }}
                  >
                    Current page: {page} --- Load more{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
