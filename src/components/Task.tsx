import { useState } from "react";
import type { TaskType } from "../types/task";
import Modal from "./Modal";
import { dataService } from "../services/dataService";

interface TaskProps extends TaskType {
    onUpdate?: () => void;
}

const Task = ({
    id,
    title,
    description,
    status,
    assigned,
    dueDate,
    onUpdate,
}: TaskProps) => {
    const [showModal, setShowModal] = useState(false);
    const [taskData, setTaskData] = useState({
        status,
        assigned,
        dueDate: dueDate || "",
    });

    const updateTask = (updates: Partial<typeof taskData>) => {
        const newData = { ...taskData, ...updates };
        setTaskData(newData);

        const updatedTask: TaskType = {
            id,
            title,
            description,
            status: newData.status,
            assigned: newData.assigned,
            dueDate: newData.dueDate || undefined,
        };

        dataService.updateTask(updatedTask);
        if (onUpdate) {
            onUpdate();
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateTask({ status: e.target.value as TaskType["status"] });
    };

    const handleAssignedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateTask({ assigned: e.target.value });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateTask({ dueDate: e.target.value });
    };
    return (
        <>
            {/* START --- TASK DETAILS MODAL */}
            {showModal && (
                <Modal
                    title={title}
                    size="xl"
                    onDismiss={() => {
                        setShowModal(false);
                    }}
                >
                    <div className="row">
                        <div className="col-9">
                            <p className="card-text">{description}</p>
                        </div>
                        <div className="col-3 gap-2">
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={taskData.status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="Backlog">Backlog</option>
                                    <option value="To do">To do</option>
                                    <option value="Needs Fix">Needs Fix</option>
                                    <option value="In progress">
                                        In progress
                                    </option>
                                    <option value="Ready for test">
                                        Ready for test
                                    </option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Assigned To
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={taskData.assigned}
                                    onChange={handleAssignedChange}
                                    placeholder="Enter assignee name"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={taskData.dueDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {/* END --- TASK DETAILS MODAL */}
            <div
                className="border border-0 border-top cursor-pointer"
                style={{ cursor: "grab" }}
                draggable
                onClick={() => setShowModal(true)}
                onDragStart={(e) => {
                    e.dataTransfer.setData(
                        "text/plain",
                        JSON.stringify({
                            id,
                            title,
                            description,
                            status: taskData.status,
                            assigned: taskData.assigned,
                            dueDate: taskData.dueDate,
                        })
                    );
                }}
            >
                <div className="card-body row g-2">
                    <h6 className="card-title">
                        <strong>{title}</strong>
                    </h6>
                    <span className="truncate-4">{description}</span>
                    <span>
                        <strong>Status:</strong> {taskData.status}
                    </span>
                    <span>
                        <strong>Assigned:</strong> {taskData.assigned}
                    </span>
                    {taskData.dueDate && (
                        <span>Due date: {taskData.dueDate}</span>
                    )}
                </div>
            </div>
        </>
    );
};

export default Task;
