import { useDrop } from "react-dnd";
import { TaskCard } from "./TaskCard";

export const Column = ({ column, tasks, onDrop, onRemoveTask, onAddTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => onDrop(item, column.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        margin: "0 10px",
        padding: "10px",
        background: isOver ? "#f0f8ff" : "#f8f9fa",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h3>{column.name}</h3>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onRemove={onRemoveTask} />
      ))}
      <button
        onClick={onAddTask}
        style={{
          marginTop: "10px",
          padding: "8px",
          width: "100%",
          cursor: "pointer",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Add Task
      </button>
    </div>
  );
};
