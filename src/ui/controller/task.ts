const get = async () => {
  return fetch("/api/tasks").then(async (response) => {
    const responseString = await response.text();
    const responseFromServer = JSON.parse(responseString);
    return responseFromServer;
  });
  /* return fetch("/api/tasks")
    .then((res) => res.json())
    .then(({ allTasks }) => {
      return allTasks;
    }); */
};

export const todoController = {
  get,
};
