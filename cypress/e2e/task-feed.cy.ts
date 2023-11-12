const BASE_URL = "http://localhost:3000";

describe("/ - Task feed", () => {
  it("Renders the page on load", () => {
    cy.visit(BASE_URL);
  });
  it("Inserts a new task in the task list and checks that it appears in the screen", () => {
    // 0 - Intercepts the request to the API not to populate the real task list
    cy.intercept("POST", `${BASE_URL}/api/tasks`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          id: "d3833576-f3af-4364-bc83-35f68599e8a7",
          date: "2023-09-18T15:44:22.173Z",
          content: "Test task",
          done: false,
        },
      });
    }).as("createTask");
    // 1 - Renders the page
    cy.visit("http://localhost:3000");
    // 2 - Selects the input field
    // 3 - Types into the input
    const addTaskInput = "input[name=add-task-input]";
    cy.get(addTaskInput).as("$addTaskInput").type("Test task");
    // 4 - Clicks the button to add a task
    const addTaskBtn = "[aria-label='Add new task']";
    cy.get(addTaskBtn).click();
    // 5 - Checks if there's a new task in the list
    cy.get("table > tbody").contains("Test task");
  });
});
