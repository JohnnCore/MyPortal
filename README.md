# MyPortal - Project Management Application

A modern project management application built with React, TypeScript, and RTK Query. Features a Kanban-style issue board with drag-and-drop, real-time updates, and team collaboration.

## Features

- **Kanban Board** - Drag-and-drop issue management with status columns
- **Real-time Updates** - Optimistic updates with RTK Query
- **Team Collaboration** - Project invites and member management
- **Issue Tracking** - Create, update, and assign issues with priorities and types
- **Comments** - Discussion threads on issues
- **Authentication** - Secure login with CSRF protection

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Tables**: @tanstack/react-table with virtualization
- **Build**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JohnnCore/MyPortal.git
cd MyPortal

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_APP_API_URL=http://localhost:4000/api
VITE_APP_DEPLOY_ENV=development
VITE_APP_DEBUG_MODE=false
```

## Available Scripts

| Script                 | Description               |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start development server  |
| `npm run build`        | Build for production      |
| `npm run typecheck`    | TypeScript type checking  |
| `npm run lint`         | Run ESLint                |
| `npm run lint:fix`     | Fix ESLint errors         |
| `npm run format`       | Format code with Prettier |
| `npm run format:check` | Check code formatting     |
| `npm run preview`      | Preview production build  |

## Project Structure

```
src/
├── api/              # API client configuration
├── App/              # Root application component
├── components/       # Reusable UI components
│   ├── board/        # Board-specific components (Board, Cards, Columns)
│   ├── common/       # Shared UI components (Button, Input, Modal)
│   ├── issue-board/  # Issue board feature components
│   ├── navigation/   # Navigation components (Navbar, Sidebar)
│   └── project/      # Project management components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
│   ├── Auth/         # Authentication hooks
│   ├── board/        # Board-related hooks
│   ├── Issues/       # Issue management hooks
│   └── Projects/     # Project management hooks
├── pages/            # Page components
├── redux/            # Redux store configuration
│   ├── api/          # RTK Query API slices
│   ├── auth/         # Auth state slice
│   └── notifications/# Notification state slice
├── routes/           # Route definitions
├── schemas/          # Zod validation schemas
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Architecture

### State Management

The application uses Redux Toolkit with RTK Query for server state management:

- **RTK Query** handles data fetching, caching, and synchronization
- **Optimistic updates** provide instant feedback for user actions
- **Cache invalidation** ensures data consistency

### Component Patterns

- **Barrel exports** for cleaner imports (`import { Board } from '@/components/board'`)
- **Colocation** of types with components (`Component.tsx` + `Component.types.ts`)
- **Custom hooks** encapsulate business logic and state management

### Form Handling

Forms use React Hook Form with Zod schemas for:

- Type-safe validation
- Declarative error handling
- Optimized re-renders

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Run `npm run lint:fix` before committing
- Run `npm run format` to format code
- Ensure `npm run typecheck` passes

## License

MIT
