export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ContextSource = 'whatsapp' | 'email' | 'notes' | 'other';

export interface Milestone {
    id: number;
    title: string;
    completed: boolean;
    completedAt?: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: string;
    deadline: string;
    createdAt: string;
    milestones?: Milestone[];
}

export interface AddTask {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: number;
    deadline: string;
    createdAt: string;
    milestones?: Milestone[];
}

export interface ContextEntry {
    id: number;
    content: string;
    source: ContextSource;
    timestamp: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface ApiStatus {
    status: boolean;
    errorText: string | null;
    successText: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    image?: string | null;
}
