import { taskStore } from "@/store/taskStore"

export const getTask = (id: number) => {
    const { tasks } = taskStore();
    const task = tasks.find((task) => task.id === id);
    return task;
}