import { create } from "zustand";

import * as api from '@/services/api';
import { ApiStatus, Task } from "@/types";
import { TaskService } from "@/services/taskService";

interface TaskStoreState {
    tasks: Task[];

    getAllTask: () => Promise<ApiStatus>;
    addTask: (task: Task) => Promise<ApiStatus>;
    importTasks: (importedTasks: Task[]) => Promise<ApiStatus>;
    updateTask: (taskId: number, updates: Partial<Task>) => Promise<ApiStatus>;
    deleteTask: (id: number) => Promise<ApiStatus>;
}

export const taskStore = create<TaskStoreState>((set, get) => ({
    tasks: [],

    getAllTask: async () => {
        try {
            const response = await TaskService.getAllTasks();
            if (response.status === 200) {
                console.log("The task list is : ", response.data);
                set({ tasks: response.data || [] });
                return {
                    status: true,
                    errorText: null,
                    successText: response.data.successText || 'Tasks retrieved successfully',
                }
            } else {
                return {
                    status: true,
                    successText: null,
                    errorText: response.data.ErrorText || "Error while fetching tasks",
                }
            }
        } catch (error: any) {
            return {
                status: false,
                successText: null,
                errorText: 'Error while retrieving tasks. Please try again.',
            }
        }
    },
    addTask: async (task: Task) => {
        try {
            const response = await TaskService.addTask(task);
            if (response.status === 201) {
                console.log("The task is : ", response.data);
                // set((state) => ({ tasks: [task, ...state.tasks] }));
                return {
                    status: true,
                    errorText: null,
                    successText: 'Tasks added successfully',
                }
            } else {
                return {
                    status: false,
                    successText: null,
                    errorText: response.data.ErrorText || 'Error while adding a new task. Please try again.',
                }
            }
        } catch (error: any) {
            return {
                status: false,
                successText: null,
                errorText: 'Error while adding a new task. Please try again.',
            }
        }
    },
    importTasks: async (importedTasks: Task[]) => {
        try {
            const response = await api.importTasks(importedTasks);
            if (response) {
                set((state) => (
                    { tasks: [...state.tasks, ...importedTasks] }
                ))
                return {
                    status: true,
                    errorText: null,
                    successText: 'Tasks imported successfully',
                }
            } else {
                return {
                    status: false,
                    successText: null,
                    errorText: 'Error while importing tasks. Please try again.',
                }
            }
        } catch (error: any) {
            return {
                status: false,
                successText: null,
                errorText: 'Error while importing tasks. Please try again. Server Error',
            }
        }
    },
    updateTask: async (taskId: number, updates: Partial<Task>) => {
        try {
            const response = await TaskService.updateTask(updates as Task, taskId);
            if (response) {
                set(state => ({
                    tasks: state.tasks.map(task => task.id === taskId ? response.data : task)
                }));
                return {
                    status: true,
                    errorText: null,
                    successText: 'Tasks added successfully',
                }
            } else {
                return {
                    status: false,
                    successText: null,
                    errorText: 'Error while updating task.',
                }
            }
        } catch (error: any) {
            return {
                status: false,
                successText: null,
                errorText: 'Error while updating task. Please try again.',
            }
        }
    },
    deleteTask: async (id: number) => {
        try {
            const respone = await TaskService.deleteTask(id);
            if (respone.status === 204) {
                set(state => ({
                    tasks: state.tasks.filter(task => task.id !== id)
                }));

                return {
                    status: true,
                    errorText: null,
                    successText: 'Tasks deleted successfully',
                }
            } else {
                return {
                    status: true,
                    successText: null,
                    errorText: 'Error while deleting a task.',
                }
            }
        } catch (error: any) {
            return {
                status: false,
                successText: null,
                errorText: 'Error while deleting a task. Please try again.',
            }
        }
    }
}));