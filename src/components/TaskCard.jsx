import { useDrag } from "react-dnd";

export const TaskCard = ({ task, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id, columnId: task.columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: "10px",
        margin: "10px 0",
        background: "white",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        border: isDragging ? "2px solid #007bff" : "1px solid #ccc",
        cursor: "grab",
      }}
    >
      <p>{task.title}</p>
      <button
        onClick={() => onRemove(task.id)}
        style={{ color: "red", border: "none", background: "none" }}
      >
        Remove
      </button>
    </div>
  );
};
