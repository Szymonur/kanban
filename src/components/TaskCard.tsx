import Task from "./Task";
import type { TaskType } from "../types/task";
import { dataService } from "../services/dataService";

interface TaskCardProps {
    card: {
        title: string;
        color: string;
    };
    tasks: TaskType[];
    onTaskUpdate?: () => void;
}

const TaskCard = ({ card, tasks, onTaskUpdate }: TaskCardProps) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        try {
            const taskData = JSON.parse(
                e.dataTransfer.getData("text/plain")
            ) as TaskType;
            if (taskData.status !== card.title) {
                const updatedTask: TaskType = {
                    ...taskData,
                    status: card.title as TaskType["status"],
                };
                dataService.updateTask(updatedTask);
                if (onTaskUpdate) {
                    onTaskUpdate();
                }
            }
        } catch (error) {
            console.error("Error handling drop:", error);
        }
    };

    return (
        <div className="col d-flex">
            <div
                className="card flex-fill text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ backgroundColor: card.color }}
            >
                <div className="p-2 row g-2">
                    <h5 className="card-title p-2 no-select">{card.title}</h5>
                    {tasks.map(
                        (task: any, index: number) =>
                            task.status === card.title && (
                                <Task
                                    key={index}
                                    {...task}
                                    onUpdate={onTaskUpdate}
                                />
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
