# Task Management UI

A modern, responsive task management frontend application built with Next.js 14, TypeScript, and Tailwind CSS. This application provides a clean interface for managing tasks through CRUD operations with advanced pagination and filtering capabilities.

## Vercel

This project is deployed on Vercel. You can access the live demo at [https://taskmanui.vercel.app](https://taskmanui.vercel.app).

## Features

### Core Functionality

- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Status Filtering**: Filter tasks by status (To Do, In Progress, Done)
- **Advanced Pagination**: Configurable items per page (6, 12, 24, 48) with navigation controls
- **Task Management**: Edit existing tasks and delete with confirmation

### User Interface

- **Responsive Grid Layout**: 1 column on mobile, up to 4 columns on desktop
- **Equal-Height Cards**: Consistent card layouts with proper text truncation
- **Modal System**: Confirmation dialogs for deletions and success feedback
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages with retry options

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** with custom utilities
- **React Query** for server state management
- **React Hook Form** with validation
- **Axios** for API communication
- **Lucide React** for icons
- **Jest + React Testing Library** for testing

## Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- A running backend API that implements the expected endpoints

## Getting Started

To get this application running on your local machine, follow these steps:

### 1. Clone and Install

```bash
git clone https://github.com/abdulhalimzhr/taskmanui.git
cd taskmanui
npm install
```

### 2. Environment Setup

You'll need to create an environment file to connect to your backend API:

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Testing

Run the test suite to make sure everything is working correctly:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main tasks page with pagination
│   ├── tasks/
│   │   ├── create/page.tsx   # Create task page
│   │   └── edit/[id]/page.tsx # Edit task page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + line-clamp utilities
├── components/
│   ├── forms/
│   │   └── TaskForm.tsx      # Reusable form for create/edit
│   ├── tasks/
│   │   ├── TaskCard.tsx      # Individual task display
│   │   ├── TaskFilters.tsx   # Status filter controls
│   │   ├── Pagination.tsx    # Advanced pagination component
│   │   └── TaskStatusBadge.tsx # Status display
│   ├── ui/
│   │   ├── ConfirmationModal.tsx # Delete confirmation
│   │   ├── SuccessModal.tsx      # Success feedback
│   │   ├── ErrorMessage.tsx      # Error display
│   │   └── LoadingSpinner.tsx    # Loading states
│   └── providers/
│       └── QueryProvider.tsx # React Query setup
├── hooks/
│   └── useTasks.ts           # Custom hook for task operations
├── lib/
│   └── api.ts                # API client with error handling
└── types/
    └── task.ts               # TypeScript interfaces
```

## API Integration

This frontend application is designed to work with a REST API backend. Your backend needs to implement these endpoints:

| Method   | Endpoint     | Description                               | Query Params              |
| -------- | ------------ | ----------------------------------------- | ------------------------- |
| `GET`    | `/tasks`     | Fetch tasks with filtering and pagination | `status`, `page`, `limit` |
| `GET`    | `/tasks/:id` | Fetch single task                         | -                         |
| `POST`   | `/tasks`     | Create new task                           | -                         |
| `PATCH`  | `/tasks/:id` | Update task                               | -                         |
| `DELETE` | `/tasks/:id` | Delete task                               | -                         |

### Expected Data Types

```typescript
interface Task {
  id: string
  title: string
  description?: string
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE'
  createdAt: string
  updatedAt: string
}

interface TasksResponse {
  data: Task[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

## Key Components

Here's how the main components work:

### TaskCard

- Equal-height layout using flexbox (`h-full flex flex-col`)
- Text truncation with custom CSS utilities (`line-clamp-2`, `line-clamp-3`)
- Overflow protection with `break-words` and `min-w-0`
- Edit and delete actions with confirmation

### Pagination

- Configurable page sizes (6, 12, 24, 48 items)
- Results information display
- Navigation controls with disabled states
- Flex layout with `justify-between` for clean organization

### TaskForm

- Shared between create and edit pages
- React Hook Form with validation
- Success modal feedback
- Loading states during submission

### Modal System

- `ConfirmationModal`: Safe deletion with confirmation
- `SuccessModal`: Feedback for successful operations
- Focus management and keyboard accessibility

## Responsive Design

The application adapts to different screen sizes:

- **Mobile (default)**: Single column grid
- **Small (sm)**: 2 columns
- **Medium (md)**: 2 columns
- **Large (lg)**: 3 columns
- **Extra Large (xl)**: 4 columns

Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

## Testing

The project includes a comprehensive test suite with high coverage. The tests cover:

- **Component Tests**: All UI components tested
- **Integration Tests**: Page flows and user interactions
- **API Tests**: Mock API responses and error handling
- **Hook Tests**: Custom hooks with various scenarios

Key test files:

- `tests/pages/TasksPage.test.tsx` - Main page functionality
- `tests/components/tasks/` - Task-related components
- `tests/components/ui/` - UI components and modals

## Implementation Details

### Pagination System

The pagination system defaults to 6 items per page, which provides a clean layout without overwhelming the user. The per-page selector is positioned at the bottom alongside the pagination controls for better organization. You'll see a results count like "Showing 1-6 of 24 tasks" and navigation buttons that are properly disabled when you reach the first or last page.

### Text Handling

Long task titles and descriptions are handled gracefully using custom CSS utilities defined in `globals.css`. The `.line-clamp-2` and `.line-clamp-3` classes ensure text doesn't break the card layout, even with very long content. Combined with `break-words` and `overflow-hidden`, this prevents any layout issues.

### State Management

The application uses React Query for all server-side state management, which handles caching, optimistic updates, and error states automatically. For UI state like filters and pagination, we use React's built-in `useState`. This approach keeps things simple while providing excellent user experience.

### Performance

React Query's intelligent caching means we don't make unnecessary API calls. When you create or delete a task, you'll see optimistic updates that make the interface feel instant. Next.js provides automatic code splitting, and the configurable pagination sizes help manage data loading efficiently.

## Deployment

### Building for Production

To build and run the application in production mode:

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set `NEXT_PUBLIC_API_URL` to your backend API URL in your production environment.

## Available Scripts

| Command                 | Description         |
| ----------------------- | ------------------- |
| `npm run dev`           | Development server  |
| `npm run build`         | Production build    |
| `npm start`             | Production server   |
| `npm test`              | Run tests           |
| `npm run test:watch`    | Tests in watch mode |
| `npm run test:coverage` | Coverage report     |
| `npm run lint`          | ESLint              |
| `npm run type-check`    | TypeScript check    |

## Customization

### Changing Pagination Options

If you want different pagination options, edit `src/components/tasks/Pagination.tsx`:

```typescript
const pageSizeOptions = [6, 12, 24, 48] // Modify as needed
```

### Updating Card Layout

To change how many columns appear at different screen sizes, modify the grid classes in `src/app/page.tsx`:

```typescript
className =
  'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
```

### Adding New Task Statuses

To add new task statuses, update the type definition in `src/types/task.ts`:

```typescript
status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'YOUR_STATUS'
```

---

**Built with Next.js 14, TypeScript, and Tailwind CSS**
