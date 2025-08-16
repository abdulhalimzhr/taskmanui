# Frontend Developer Challenge: Task Management UI

## Objective

Build a responsive and user-friendly web application to interact with the Task Management API (developed in the backend challenge).

## Core Requirements

- Use Next.js with TypeScript for the frontend application
- Consume the previously defined backend API for all task operations
- Implement UI for CRUD (Create, Read, Update, Delete) operations for tasks
- Ensure a clean, intuitive, and responsive user interface
- Manage application state effectively
- The application should be deployable on Vercel

## 1. Project Setup

### Next.js & TypeScript

- Initialize a new Next.js project using TypeScript:
  ```bash
  npx create-next-app@latest --typescript .
  ```
- Structure your project logically (e.g., `components/`, `pages/`, `services/` or `lib/api/`, `hooks/`, `types/`)

### Environment Variables

- Configure the application to use an environment variable (e.g., `NEXT_PUBLIC_API_URL`) for the base URL of the backend API

## 2. Task Type Definition

Define a TypeScript interface or type for the Task object, matching the structure returned by the backend API:

```typescript
// Example: in types/task.ts
export interface Task {
  id: string; // or number, depending on backend implementation
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  createdAt: string; // or Date
  updatedAt: string; // or Date
}
```

## 3. UI Features & Pages

Implement the following pages and features:

### A. Task List Page (e.g., `/` or `/tasks`)

- **Display Tasks**: Fetch and display a list of all tasks from `GET /tasks`
  - For each task, display at least its title and status
  - Provide visual cues for different task statuses (e.g., color coding)
- **Filtering**: Implement UI controls (e.g., dropdown, buttons) to filter tasks by status (TO_DO, IN_PROGRESS, DONE), utilizing the `?status=` query parameter of the backend
- **Pagination**: Implement pagination controls (e.g., "Next," "Previous" buttons, page numbers) to navigate through tasks, utilizing the `?page=` and `?limit=` query parameters of the backend
- **Actions per Task**: For each task in the list, provide:
  - An "Edit" button/icon that navigates to the Edit Task Page
  - A "Delete" button/icon that triggers the `DELETE /tasks/:id` API call (with a confirmation dialog)
- **Create Task**: A prominent "Add New Task" button that navigates to the Create Task Page

### B. Create Task Page (e.g., `/tasks/create`)

- A form with input fields for:
  - title (required)
  - description (optional)
- A "Save Task" or "Create Task" button that submits the form data to `POST /tasks`
- Upon successful creation, redirect the user to the Task List Page or display a success message
- Handle potential API errors and display appropriate messages

### C. Edit Task Page (e.g., `/tasks/edit/[id]`)

- Fetch the task details using `GET /tasks/:id` based on the ID from the URL
- A form pre-filled with the existing task's title, description, and status
- Input fields to modify:
  - title (required)
  - description (optional)
  - status (e.g., a dropdown with 'TO_DO', 'IN_PROGRESS', 'DONE')
- An "Update Task" or "Save Changes" button that submits the form data to `PATCH /tasks/:id`
- Upon successful update, redirect the user to the Task List Page or display a success message
- Handle potential API errors (including 404 if the task doesn't exist) and display appropriate messages

## 4. API Integration

- Create a dedicated service or set of utility functions for making API calls to the backend (e.g., using fetch API or a library like axios)
- Handle API responses, including success and error states
- Display loading indicators while data is being fetched or submitted
- Show user-friendly error messages for API failures (e.g., network errors, server errors, validation errors from the backend)

## 5. State Management

- Choose an appropriate state management solution for your application. Options include:
  - React Context API (for simpler state)
  - Zustand, Jotai, or Recoil (for more complex global state)
  - React Query or SWR (highly recommended for managing server state, caching, refetching, etc.)
- Manage state for the task list, form inputs, loading states, and error states

## 6. Styling

- Style the application to be visually appealing and user-friendly
- Ensure the layout is responsive and works well on different screen sizes (mobile, tablet, desktop)
- You can use:
  - Tailwind CSS (recommended for Next.js)
  - CSS Modules
  - Styled Components or Emotion
  - A component library like Material UI, Chakra UI, or Ant Design
- Focus on clarity, usability, and a modern look and feel

## 7. Validation

- Implement basic client-side validation for form inputs (e.g., title cannot be empty)
- Display clear validation messages to the user

## 8. Testing (Bonus)

- Write unit tests for key components (e.g., a Task item component, form components) using Jest and React Testing Library
- Consider writing integration tests for page flows if time permits

## 9. Deployment

- The application should be easily deployable to Vercel
- Ensure environment variables are correctly configured for Vercel deployment

## Submission Guidelines

- Provide a link to a Git repository (e.g., GitHub, GitLab)
- The repository should contain:
  - All source code for the Next.js application
  - A README.md file with clear instructions on:
    - How to set up the project locally (install dependencies, run development server)
    - How to configure the `NEXT_PUBLIC_API_URL` environment variable
    - How to run tests (if implemented)
    - A link to the deployed Vercel application
    - Any assumptions made or design choices
- Ensure the code is well-structured, clean, and documented where necessary

## Evaluation Criteria

- **Functionality**: Does the application meet all the specified UI features and interact correctly with the backend API?
- **Code Quality**: Is the TypeScript and React code clean, readable, maintainable, and well-structured?
- **Next.js Best Practices**: Is the Next.js framework used effectively (routing, data fetching, component structure)?
- **State Management**: Is state managed efficiently and appropriately?
- **UI/UX**: Is the interface intuitive, responsive, and visually appealing?
- **API Integration**: Is the interaction with the backend API robust and error-handled?
- **Validation**: Is client-side validation implemented correctly?
- **Testing** (if applicable): Are there meaningful tests?
- **Deployment**: Can the application be successfully deployed and run on Vercel?
- **Documentation**: Is the README.md clear and helpful?