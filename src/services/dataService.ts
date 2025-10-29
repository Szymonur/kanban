import type { TaskType } from "../types/task";
import type { UserType } from "../types/user";
import { db, auth } from "./firebaseConfig";
import {
    collection,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
} from "firebase/firestore";

export const dataService = {
    async getTasks(): Promise<TaskType[]> {
        const user = auth.currentUser;
        if (!user) return [];
        const q = query(
            collection(db, "tasks"),
            where("ownerUid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as TaskType)
        );
    },

    async addTask(task: TaskType): Promise<TaskType | null> {
        const user = auth.currentUser;
        if (!user) return null;
        const taskWithOwner = { ...task, ownerUid: user.uid };
        const docRef = await addDoc(collection(db, "tasks"), taskWithOwner);
        return { ...taskWithOwner, id: docRef.id };
    },

    async updateTask(updatedTask: TaskType): Promise<void> {
        if (!updatedTask.id) return;
        // Remove id from update payload
        const { id, ...updateFields } = updatedTask;
        await updateDoc(doc(db, "tasks", updatedTask.id), updateFields);
    },

    async deleteTask(taskId: string): Promise<void> {
        await deleteDoc(doc(db, "tasks", taskId));
    },

    async getUsers(): Promise<UserType[]> {
        const user = auth.currentUser;
        if (!user) return [];

        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...(doc.data() as Omit<UserType, "id">),
                } as UserType)
        );
    },
};
