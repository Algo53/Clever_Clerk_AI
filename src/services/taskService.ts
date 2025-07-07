import { Task } from "@/types";
import apiClient from "./apiClient"

export const TaskService = {
    getAllTasks: async () => {
        const respone = await apiClient.get('tasks/');
        return respone;
    },
    getTodayTasks: async () => {
        const response = await apiClient.get('tasks/today/');
        return response;
    },
    getSingleTaskDetail: async (id: number) => {
        const response = await apiClient.get(`tasks/${id}/`);
        return response;
    },
    addTask: async (task: Task | Task[]) => {
        const response = await apiClient.post('tasks/', task);
        return response;
    },
    updateTask: async (task: Task, taskId: number) => {
        const response = await apiClient.patch(`tasks/${taskId}/`, task);
        return response;
    },
    deleteTask: async (id: number) => {
        const response = await apiClient.delete(`tasks/${id}/`);
        return response;
    }
}