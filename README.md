# WTM Agent

A hotel booking application for agents to search, book, and manage hotel reservations. Built with Next.js 15, React 19, and TypeScript, featuring a modern UI with ShadCN UI components.

## Technology Stack

### Core Framework

- **Next.js 15.3.6** - React framework

- **React 19**

- **TypeScript 5**

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework

- **ShadCN UI** - Base UI Component

### Forms & Validation

- **React Hook Form 7** - Form state management

- **Zod 3.25** - Schema validation

### Data Management & Tables

- **TanStack Table 8** - Advanced table functionality
- **nuqs 2.7** - Type-safe URL query state management

### File Handling & PDF

- **@react-pdf/renderer 4.3** - PDF generation and rendering

## Project Structure

The project follows Next.js 15 App Router architecture:

### Pages (App Router)

All pages are located in the `app/` directory:

```

app/

├── (protected)/ # Protected routes requiring authentication

│ ├── cart/ # Shopping cart management

│ ├── contact-us/ # Contact form

│ ├── history-booking/ # Booking history and logs

│ ├── home/ # Main hotel search and listing

│ ├── hotel/[id]/ # Hotel detail page (dynamic route)

│ ├── settings/ # User profile and account settings

│ └── layout.tsx # Protected pages layout

├── api/

│ ├── auth/ # NextAuth API routes

├── login/page.tsx

├── register/page.tsx

├── forgot-password/page.tsx

├── reset-password/page.tsx

└── logout/page.tsx

```

### Actions & Fetch Files

Each feature typically has server-side files following this pattern:

- **`actions.ts`** - Server actions for mutations (create, update, delete)

- **`fetch.ts`** - Data fetching functions for queries

- **`types.ts`** - TypeScript type definitions for the feature

- **`page.tsx`** - Page component rendering the UI

```

app/(protected)/

├── cart/

│ ├── actions.ts # Cart operations (add, remove, update)

│ ├── fetch.ts # Fetch cart data

│ ├── types.ts # Cart type definitions

│ └── page.tsx # Cart page UI

├── home/

│ ├── fetch.ts # Fetch hotels list

│ ├── types.ts # Hotel search types

│ └── page.tsx # Home search page

├── hotel/[id]/

│ ├── actions.ts # Booking actions

│ ├── fetch.ts # Fetch hotel details

│ ├── types.ts # Hotel detail types

│ ├── loading.tsx # Loading state

│ └── page.tsx # Hotel detail page

└── settings/

├── actions.ts # Profile update actions

├── fetch.ts # Fetch user settings

├── types.ts # Settings types

└── page.tsx # Settings page

```

### Components

Components are organized by feature and reusability:

```

components/

├── cart/ # Cart-specific components

│ ├── dialog/ # Cart-related dialogs

│ ├── table/ # Cart items table

│ ├── booking-details-section.tsx

│ ├── contact-details-section.tsx

│ └── guest-context.tsx

├── contact-us/ # Contact form components

├── data-table/ # Reusable table components with advanced features

├── footer/ # Footer component

├── header/ # Header navigation components

│ ├── cart-button.tsx

│ ├── desktop-navigation.tsx

│ ├── mobile-menu.tsx

│ ├── nav-dropdown.tsx

│ ├── nav-user.tsx

│ └── notification-button.tsx

├── history-booking/ # Booking history components

│ ├── dialog/ # Invoice and booking dialogs

│ └── table/ # Booking history table

├── home/ # Home page components

│ ├── filter-sidebar.tsx

│ ├── hotel-results.tsx

│ ├── promo-banner.tsx

│ └── search-filter.tsx

├── hotel-detail/ # Hotel detail page components

│ ├── gallery.tsx

│ ├── gallery-dialog.tsx

│ ├── info.tsx

│ ├── room-card.tsx

│ ├── room-details-dialog.tsx

│ └── additional-services.tsx

├── login/ # Authentication forms

│ ├── login-form.tsx

│ ├── forgot-password-form.tsx

│ └── reset-password-form.tsx

├── register/ # Registration form

├── settings/ # Settings page components

├── ui/ # Shared UI primitives (ShadCN components)

└── providers/ # React context providers

```

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** (LTS recommended)

- **pnpm** (package manager)

### Step-by-Step Installation

1.  **Clone the repository**

```bash

git  clone  <repository-url>

cd  wtm-agent

```

2.  **Install dependencies**

```bash

npm  install

```

3.  **Configure environment variables**

Create a `.env` file in the root directory with the following variables:

```env

# Backend API Base URL

AUTH_API_BASE_URL=http:/localhost:4816/api

```

**Required Environment Variables:**

- `AUTH_API_BASE_URL`: Backend API endpoint for authentication and data

4.  **Run the development server**

```bash

npm  dev

```

The application will start at [http://localhost:3000](http://localhost:3000)

5.  **Access the application**

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

You'll be redirected to the login page. Use valid credentials provided by your backend API.

### Building for Production

1.  **Create an optimized production build**

```bash

npm  build

```

2.  **Start the production server**

```bash

npm  start

```

3.  **Preview the production build**

The production server will run at [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |

| ------------ | ------------------------------------------------------------ |

| `npm dev` | Start development server with Turbopack (hot reload enabled) |

| `npm build` | Create optimized production build |

| `npm start` | Start production server |

### Development Notes

- **Image Optimization**: Next.js Image component is configured for multiple remote domains including ImageKit, MinIO, and TheHotelBox API (see `next.config.ts`)

- **Server Actions**: Maximum body size is set to 4MB for file uploads
