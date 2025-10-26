import { useState } from "react";
import type { TaskType } from "../types/task";

interface CreateTaskFormProps {
    onSubmit: (task: TaskType) => void;
}

const CreateTaskForm = ({ onSubmit }: CreateTaskFormProps) => {
    const [task, setTask] = useState<TaskType>({
        id: "",
        title: "",
        description: "",
        status: "Backlog",
        assigned: "",
        dueDate: undefined,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(task);

        // Reset form
        setTask({
            id: "",
            title: "",
            description: "",
            status: "Backlog",
            assigned: "",
            dueDate: undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    rows={3}
                    value={task.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                    className="form-select"
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                >
                    <option value="Backlog">Backlog</option>
                    <option value="To do">To do</option>
                    <option value="Needs Fix">Needs Fix</option>
                    <option value="In progress">In progress</option>
                    <option value="Ready for test">Ready for test</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Assigned</label>
                <input
                    type="text"
                    className="form-control"
                    name="assigned"
                    value={task.assigned}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={task.dueDate || ""}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]} // prevent past dates
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Create Task
            </button>
        </form>
    );
};

export default CreateTaskForm;
