import { Task, ContextEntry, Category, Milestone } from "@/types";
import { DUMMY_CONTEXT_ENTRIES, DUMMY_CATEGORIES } from "@/lib/constants";

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const DUMMY_TASKS: Task[] = [
  {
    id: 1,
    title: 'Finalize Q3 report presentation',
    description: 'Gather all the data from the team and create the final presentation slides for the Q3 review meeting.',
    status: 'in-progress',
    priority: 'urgent',
    category: 'Work',
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    milestones: [
        { id: 11, title: 'Gather sales data', completed: true, completedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
        { id: 12, title: 'Collect marketing metrics', completed: true, completedAt: new Date().toISOString() },
        { id: 13, title: 'Draft presentation slides', completed: false },
        { id: 14, title: 'Review with management', completed: false },
    ]
  },
  {
    id: 2,
    title: 'Book dentist appointment',
    description: 'Call the clinic to schedule a routine check-up.',
    status: 'todo',
    priority: 'medium',
    category: 'Health',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: 3,
    title: 'Buy groceries for the week',
    description: 'Milk, eggs, bread, chicken, and vegetables.',
    status: 'todo',
    priority: 'high',
    category: 'Shopping',
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation for the upcoming long weekend.',
    status: 'todo',
    priority: 'low',
    category: 'Personal',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    milestones: [
        { id: 41, title: 'Choose destination', completed: true, completedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
        { id: 42, title: 'Find hotel/airbnb', completed: false },
        { id: 43, title: 'Book travel tickets', completed: false },
    ]
  },
  {
    id: 5,
    title: 'Review project proposal from team B',
    description: 'Read through the new proposal and provide feedback by end of day.',
    status: 'done',
    priority: 'high',
    category: 'Work',
    deadline: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
];


// Let's use a simple in-memory store to simulate a database for CUD operations
let tasks: Task[] = [...DUMMY_TASKS];
let contextEntries: ContextEntry[] = [...DUMMY_CONTEXT_ENTRIES];
let categories: Category[] = [...DUMMY_CATEGORIES];

export const getTasks = async (): Promise<Task[]> => {
  await delay(500);
  return [...tasks];
};

export const getTask = async (id: number): Promise<Task | undefined> => {
    await delay(300);
    return tasks.find(task => task.id === id);
}

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  await delay(500);
  const newTask: Task = {
    ...taskData,
    id: Math.random()*1000,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(newTask);
  return newTask;
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task | null> => {
    await delay(500);
    let targetTaskIndex = tasks.findIndex(task => task.id === id);
    if (targetTaskIndex !== -1) {
        tasks[targetTaskIndex] = { ...tasks[targetTaskIndex], ...updates };
        return { ...tasks[targetTaskIndex] };
    }
    return null;
}

export const deleteTask = async(id: number): Promise<{ success: boolean }> => {
    await delay(500);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return { success: tasks.length < initialLength };
}

export const getContextEntries = async (): Promise<ContextEntry[]> => {
  await delay(500);
  return [...contextEntries];
};

export const addContextEntry = async (entryData: Omit<ContextEntry, 'id' | 'timestamp'>): Promise<ContextEntry> => {
  await delay(500);
  const newEntry: ContextEntry = {
    ...entryData,
    id: Math.random()*20000,
    timestamp: new Date().toISOString(),
  };
  contextEntries.unshift(newEntry);
  return newEntry;
};

export const getCategories = async (): Promise<Category[]> => {
    await delay(200);
    return [...categories];
}

export const importTasks = async(newTasks: Task[]): Promise<boolean> => {
    await delay(500);
    // In a real app, you might want to merge or validate tasks.
    // For now, we'll just replace them.
    tasks = [...newTasks];
    return true;
}