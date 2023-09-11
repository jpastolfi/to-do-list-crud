import React from "react";
import { useState, useEffect } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/task";
const bg = "/bg.jpeg";
interface HomeTask {
  id: string;
  content: string;
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

  useEffect(() => {
    // 1
    todoController.get({ page }).then(({ tasks, pages }) => {
      setTasks((oldTasks) => {
        return [...oldTasks, ...tasks];
      });
      setTotalPages(pages);
    });
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
        <form>
          <input type="text" placeholder="Correr, Estudar..." />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input type="text" placeholder="Filtrar lista atual, ex: Dentista" />
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
            {tasks.map(({ id, content }) => (
              <tr key={id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{id.substring(0, 4)}</td>
                <td>{content}</td>
                <td align="right">
                  <button data-type="delete">Apagar</button>
                </td>
              </tr>
            ))}

            {/* <tr>
              <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                Carregando...
              </td>
            </tr> */}

            {/* <tr>
              <td colSpan={4} align="center">
                Nenhum item encontrado
              </td>
            </tr> */}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => setPage(page + 1)}
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
