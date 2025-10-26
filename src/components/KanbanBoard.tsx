import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import Modal from "./Modal";
import type { TaskType } from "../types/task";

const KanbanBoard = () => {
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState<TaskType[]>([]);

    useEffect(() => {
        setTasks(dataService.getTasks()); // initial load
    }, []);

    const addTask = (task: TaskType) => {
        dataService.addTask(task); // save in LocalStorage
        setTasks(dataService.getTasks()); // update state
    };

    const refreshTasks = () => {
        setTasks(dataService.getTasks()); // refresh tasks from localStorage
    };

    const TaskCards = [
        { title: "Backlog", color: "#dee2e675" },
        { title: "To do", color: "#6EA8FE75" },
        { title: "Needs Fix", color: "#EA868F75" },
        { title: "In progress", color: "#FFDA6975" },
        { title: "Ready for test", color: "#75B89875" },
        { title: "Done", color: "#A98EDA75" },
    ];

    return (
        <div className="container-fluid">
            {/* START --- CREATE NEW TASK MODAL */}
            {showModal && (
                <Modal
                    title="Create task"
                    onDismiss={() => setShowModal(false)}
                >
                    <TaskForm
                        onSubmit={(task) => {
                            addTask(task);
                            setShowModal(false);
                        }}
                    />
                </Modal>
            )}
            {/* END --- CREATE NEW TASK MODAL */}

            {/* START ---  HEADER AND ADD TASK BUTTON */}
            <div className="d-flex align-items-center justify-content-between p-2">
                <button
                    type="button"
                    className="btn btn-secondary bt n-sm"
                    onClick={() => setShowModal(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                </button>
                <h1 className="text-center fs-2 m-0 flex-grow-1">
                    Kanban Board
                </h1>
                <div style={{ width: "48px" }}></div>
            </div>
            {/* END ---  HEADER AND ADD TASK BUTTON */}

            {/* TASK CARDS  */}
            <div className="row g-2">
                {TaskCards.map((card, index) => (
                    <TaskCard
                        tasks={tasks}
                        key={index}
                        card={card}
                        onTaskUpdate={refreshTasks}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
