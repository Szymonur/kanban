export interface TaskType {
    id: string;
    title: string;
    description: string;
    status:
        | "Backlog"
        | "To do"
        | "Needs Fix"
        | "In progress"
        | "Ready for test"
        | "Done";
    assigned: string;
    dueDate?: string;
}
