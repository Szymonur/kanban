import { useState } from "react";
import { dataService } from "../services/dataService";
import type { TaskType } from "../types/task";
import Modal from "./Modal";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "codemirror/lib/codemirror.css";

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
    const [editescription, setEditescription] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskData, setTaskData] = useState({
        status,
        assigned,
        dueDate: dueDate || "",
        description: description,
    });

    const updateTask = (updates: Partial<typeof taskData>) => {
        const newData = { ...taskData, ...updates };
        setTaskData(newData);

        const updatedTask: TaskType = {
            id,
            title,
            description: newData.description || description,
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
    const handleDescriptionChange = (value: string) => {
        updateTask({ description: value });
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
                        <div className="col-9 text-start">
                            <div>
                                <div style={{ height: "100%" }}>
                                    {!editescription && (
                                        <ReactMarkdown>
                                            {taskData.description}
                                        </ReactMarkdown>
                                    )}
                                    {editescription && (
                                        <SimpleMDE
                                            value={taskData.description}
                                            onChange={handleDescriptionChange}
                                        />
                                    )}
                                </div>
                                <button
                                    className="btn btn-light m-1 "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditescription(!editescription);
                                    }}
                                >
                                    {editescription ? "💾" : "✏️"}
                                </button>
                            </div>
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
                            <button
                                className="btn btn-outline-danger mt-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteConfirm(true);
                                }}
                            >
                                Delete task
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            {/* END --- TASK DETAILS MODAL */}

            {/*START --- DELETE CONFIRMATION MODAL */}
            {showDeleteConfirm && (
                <Modal
                    title="Confirm delete"
                    onDismiss={() => setShowDeleteConfirm(false)}
                >
                    <div>
                        <p>
                            Are you sure you want to delete the task "
                            <strong>{title}</strong>"?
                        </p>
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-secondary me-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteConfirm(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dataService.deleteTask(id);
                                    setShowDeleteConfirm(false);
                                    setShowModal(false);
                                    if (onUpdate) onUpdate();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            {/* END --- DELETE CONFIRMATION MODAL */}
            <div
                className="border border-0 border-top border-dark cursor-pointer"
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
                    <h6 className="card-title m-0">
                        <strong>{title}</strong>
                    </h6>
                    <span
                        className="truncate-4 text-start"
                        style={{ fontSize: "13px" }}
                    >
                        <ReactMarkdown>{taskData.description}</ReactMarkdown>
                    </span>
                    <span className="text-start">
                        <strong>Status:</strong> {taskData.status}
                    </span>
                    <span className="text-start">
                        <strong>Assigned:</strong> <br /> {taskData.assigned}
                    </span>
                    {taskData.dueDate && (
                        <span className="text-start">
                            Due date: {taskData.dueDate}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};

export default Task;
