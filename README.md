# To do List

Hi! This is going to be a to do list created using JavaScipt, TypeScript and Next, along with several other libraries. It's been developed by [me] using [Mario's] CRUD course as a guidance. I hope you enjoy it and find it useful.

The deployed version can be accessed through this [link].

# Features
As it was mentioned earlier, this is going to be a to do list. In it you'll be able to:

- Create new tasks
-- Each created task has a unique ID, generated using [uuid]
-- It's not possible to create a task without a minimal 3-character-length text, avoiding the creating of pointless, not descriptive tasks.
- Set tasks are complete
-- When you click the checkbox to set a task as complete, the content of that task is going to be crossed to make it clear that it's finished.
- Delete tasks
-- By clicking the "Delete" button, you can delete tasks from the list
-- When no tasks are listed, a "no tasks found" message is going to be shown
<!-- - Alter the color schema of the page
-- By choosing an item from the dropdown list, you can change the color schema of the page -->
- Filter tasks
-- By typing into the field on top of the tasklist you can filter the current tasks, selecting the ones you want to view.

# Testing
The application has been tested using Cypress. The tests are located inside cypress/e2e.

# Continuous Integration and Continuous Delivery
Whenever there is a push to a branch, the linter checks and Cypress tests are going to run. If one of the checks does not run as expected, it's not going to be possible to merge with the main branch. Plus, whenever there is an alteration to the main branch, the project is going to be redeployed, keeping it up to date.

# Database for saving tasks
The project uses Supabase, an open source Firebase alternative, to save the current tasks to the tasklist. You can close the tab, reload or open from a different device and your tasklist is going to be preserved between devices.

# Responsive design
The project is responsive, meaning you can use it both from a notebook and from a mobile device without any problem.

[uuid]: <https://www.npmjs.com/package/uuid>
[me]: <https://www.linkedin.com/in/jpastolfi/>
[Mario's]: <https://github.com/omariosouto/>
[link]: <https://to-do-list-crud-one.vercel.app/>
