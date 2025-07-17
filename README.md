# 🎓 Clever Clerk AI

**Clever Clerk AI** is an AI‑powered task and context management web app that helps you organize, prioritize, and schedule your to‑dos—backed by Next.js, TypeScript, Tailwind CSS, Radix UI components, Zustand state management, and GenKit/GoogleAI for intelligent suggestions.

---

## 🚀 Table of Contents

1. [Demo](#-demo)  
2. [Screenshots](#-screenshots)  
3. [Features](#-features)  
4. [Tech Stack](#-tech-stack)  
5. [Architecture & Folder Structure](#-architecture--folder-structure)  
6. [Getting Started](#-getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running Locally](#running-locally)  
7. [Usage](#-usage)   
8. [Contact](#-contact)

---

## 🎬 Demo

> Coming soon: live demo link on Vercel  

## 📸 Screenshots

| Home Page              |          |
|--------------------------|----------------------------|
| ![Home Page](/screenshots/Home_a.png) | ![Home Page](/screenshots/Home_b.png) |



| Login Page              |    Signup      |
|--------------------------|----------------------------|
| ![Login](/screenshots/Login.png) | ![Signup](/screenshots/Signup.png) |

| About Page          |   Contact Page       |
|--------------------------|----------------------------|
| ![About Page](/screenshots/About.png) | ![About Page](/screenshots/Contact.png) |


| Dashboard              |          |
|--------------------------|----------------------------|
| ![Dashboard](/screenshots/dashboard_a.png) | ![Dashboard](/screenshots/dashboard_b.png) |

| Dashboard              |          |
|--------------------------|----------------------------|
| ![Dashboard](/screenshots/dashboard_d.png)| ![Dashboard](/screenshots/dashboard_c.png) |


| Task List             |          |
|--------------------------|----------------------------|
| ![Tasks](/screenshots/Tasks_a.png)| ![Tasks](/screenshots/Tasks_b.png) |

| Task List             |          |
|--------------------------|----------------------------|
| ![Tasks](/screenshots/Tasks_c.png)| ![Tasks](/screenshots/Tasks_d.png) |


| Task           |          |
|--------------------------|----------------------------|
| ![Task](/screenshots/task_b.png)| ![Task](/screenshots/task_a.png) |

| Add Task           |          |
|--------------------------|----------------------------|
| ![Add Task](/screenshots/Add_a.png)| ![Add Task](/screenshots/Add_b.png) |

---

## ✨ Features

- **User Authentication**  
  - Sign up / log in with secure tokens (Zustand stores and hydrates auth state).  
- **Landing Page**  
  - Beautiful, responsive hero section, feature highlights, and footer.  
- **Dashboard Overview**  
  - Dynamic greeting (`Good Morning` / `Afternoon` / etc.) based on local time.  
  - Real‑time clock display (24‑hour format).  
- **Task Management**  
  - Create, read, update, and delete tasks with title, description, deadline, priority (low/normal/urgent), and status (todo, in‑progress, done).  
  - Filter tasks by timeframe: This Week, This Month, or All Time.  
- **Data Visualization**  
  - Pie/Bar charts for task status distribution and priority breakdown (built with Recharts).  
  - “Tasks Completed Today” and “Urgent Tasks” summary cards.  
  - Bar chart for priority breakdown  
  - Progress line chart over time 

- **AI‑Powered Suggestions**  
  - Context tagging and suggested schedule generation using GenKit AI + GoogleAI.  
  - Auto‑generate next‑step recommendations and time estimates.  
- **Responsive, Accessible UI**  
  - Tailwind CSS + Radix UI primitives  
  - Keyboard‑accessible modals, tabs, dropdowns  
  - Mobile‑first layout  
  
- **State Management**  
  - Lightweight global state with Zustand for tasks, contexts, and auth.  
- **Form Validation**  
  - React Hook Form + Zod for type‑safe, schema‑driven input handling.  

---

## 🧰 Tech Stack

- **Framework**: Next.js (App Router, TypeScript)  
- **Styling**: Tailwind CSS, Tailwind Animate, Tailwind‑Merge  
- **UI Library**: Radix UI, Lucide React icons  
- **Charts**: Recharts  
- **State**: Zustand  
- **Forms & Validation**: React Hook Form, Zod, @hookform/resolvers  
- **API & AI**: Axios, GenKit AI, @genkit‑ai/googleai  
- **Utilities**: date‑fns, class‑variance‑authority, js‑cookie, dotenv  
- **Linting/Formatting**: ESLint, Prettier (via `eslint.config.mjs`)  
- **Deployment**: Vercel  

---

## 📁 Architecture & Folder Structure
```
├── public/ # Static assets (images, icons, fonts)
├── src/
│ ├── app/
│ │ ├── page.tsx # Landing page
│ │ └── dashboard/
│ │     └── page.tsx # Main dashboard
│ ├── components/
│ │ ├── landing/ # Hero, Features, Header, Footer
│ │ ├── dashboard/ # Charts, Task lists, SuggestedSchedule
│ │ └── ui/ # Radix‑wrapped UI primitives (Card, Tabs,…)
│ ├── store/ # Zustand stores (authStore, taskStore, contextStore)
│ ├── lib/ # Utility functions (e.g. cn, date helpers)
│ └── styles/ # Global styles, Tailwind config overrides
├── .env.example # Sample environment variables
├── next.config.ts # Next.js settings
├── tailwind.config.ts # Tailwind CSS config
├── tsconfig.json # TypeScript settings
├── package.json # Project metadata & dependencies
└── README.md # ← You are here
```


---

## 🏁 Getting Started

### Prerequisites

- Node.js ≥ 18  
- npm / yarn / pnpm / bun  
- Google Cloud project with AI APIs enabled (if using GoogleAI)  
- Vercel account (for production deployment)

### Installation

1. **Clone the repo**  
    ```bash
    git clone https://github.com/Algo53/Clever_Clerk_AI.git
    cd Clever_Clerk_AI
   
2. **Install dependencies**  
    ```bash
    npm install
    # or
    yarn
    # or
    pnpm install

3. **Environment Variables**  
    Create a *.env.local* or *.env* in the project root:

    ```bash
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
    GOOGLEAI_API_KEY=your_google_ai_key_here
    # If you have other keys, e.g. OpenAI:
    OPENAI_API_KEY=your_openai_api_key_here
    ```
    
    Note: All keys prefixed with NEXT_PUBLIC_ are exposed to client code.

4. **Running Locally**
    ```bash
    # Start development server with Turbopack
    npm run dev
    # Open http://localhost:3000 in your browser
    ```

5. **Building for Production**
    ```bash
    npm run build
    npm start
    ```

---
## 📖 Usage

- Sign up or log in on the landing page.

- Arrive at your Dashboard—view your tasks, metrics, and AI‑generated suggestions.

- Create new tasks with deadlines and priorities.

- Filter by week, month, or view all.

- Mark tasks done → watch the “Completed Today” card update.

- Explore charts to see your progress at a glance.

- Generate a suggested schedule via the “Suggested Schedule” AI feature.

- Manage Contexts (tags/topics) to group related tasks.

- Tip: Feel free to customize the UI, swap AI providers, or extend the data model!

---
## 📬 Contact
> Author: Varun

> GitHub: Algo53

> Email: varunjangra4953@gmail.com

- Feel free to open issues or reach out if you have questions, suggestions, or want to collaborate.