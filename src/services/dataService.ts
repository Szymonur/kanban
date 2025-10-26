import type { TaskType } from "../types/task";

const STORAGE_KEY = "tasks";

export const dataService = {
    getTasks(): TaskType[] {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    },

    addTask(task: TaskType) {
        const taskWithId = { ...task, id: Date.now().toString() };
        const tasks = this.getTasks();
        const updated = [...tasks, taskWithId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return taskWithId;
    },

    updateTask(updatedTask: TaskType) {
        const tasks = this.getTasks();
        const newList = tasks.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    },

    deleteTask(taskId: string) {
        const tasks = this.getTasks();
        const newList = tasks.filter((t) => t.id !== taskId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    },
};
