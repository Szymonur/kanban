import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import Modal from "./Modal";
import type { TaskType } from "../types/task";
import type { UserType } from "../types/user";

import UserMenu from "./UserMenu";

const KanbanBoard = () => {
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            const fetchedTasks = await dataService.getTasks();
            setTasks(fetchedTasks);
            setLoading(false);
        };
        fetchTasks();
    }, []);

    const addTask = async (task: TaskType) => {
        setLoading(true);
        await dataService.addTask(task);
        const updatedTasks = await dataService.getTasks();
        setTasks(updatedTasks);
        setLoading(false);
    };

    const refreshTasks = async () => {
        setLoading(true);
        const refreshedTasks = await dataService.getTasks();
        setTasks(refreshedTasks);
        setLoading(false);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const fetchedUsers = await dataService.getUsers();
            console.log("Fetched users:", fetchedUsers); // <- tu logujemy
            setUsers(fetchedUsers);
            setLoading(false);
        };
        fetchUsers();
    }, []);

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
                        onSubmit={async (task) => {
                            await addTask(task);
                            setShowModal(false);
                        }}
                    />
                </Modal>
            )}
            {/* END --- CREATE NEW TASK MODAL */}

            {/* START ---  HEADER AND ADD TASK BUTTON */}
            <div className="position-relative d-flex align-items-center p-2">
                <div className="d-flex align-items-center">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
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
                </div>
                <h1
                    className="text-center fs-2 m-0 position-absolute w-100"
                    style={{
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                    }}
                >
                    Kanban Board
                </h1>
                <div className="d-flex align-items-center ms-auto">
                    <UserMenu />
                </div>
            </div>
            {/* END ---  HEADER AND ADD TASK BUTTON */}

            {/* TASK CARDS  */}
            {loading ? (
                <div className="text-center py-5">
                    <span
                        className="spinner-border"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    <span className="ms-2">Loading tasks...</span>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default KanbanBoard;
