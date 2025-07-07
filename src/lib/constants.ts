import { Task, ContextEntry, Category } from "@/types";

export const DUMMY_CATEGORIES: Category[] = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Shopping' },
  { id: 4, name: 'Health' },
];

export const DUMMY_TASKS: Task[] = [
  {
    id: 1,
    title: 'Finalize Q3 report presentation',
    description: 'Gather all the data from the team and create the final presentation slides for the Q3 review meeting.',
    status: 'in-progress',
    priority: 'urgent',
    category: 'Work',
    deadline: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    createdAt: new Date().toISOString(),
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

export const DUMMY_CONTEXT_ENTRIES: ContextEntry[] = [
    {
        id: 1,
        content: 'From: boss@example.com - "Hey, can we move the deadline for the Q3 report to this Wednesday? It\'s super important we get it to the stakeholders ASAP."',
        source: 'email',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
    },
    {
        id: 2,
        content: 'Reminder from calendar: "Dentist check-up next month"',
        source: 'notes',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 8)).toISOString(),
    },
    {
        id: 3,
        content: 'WhatsApp from Sarah: "Don\'t forget we need to buy a birthday gift for mom!"',
        source: 'whatsapp',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
    }
];
