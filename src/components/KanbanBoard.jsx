import { useState, useEffect } from "react";
import { Column } from "./Column";

const LOCAL_STORAGE_COLUMNS_KEY = "kanban_columns";
const LOCAL_STORAGE_TASKS_KEY = "kanban_tasks";

export const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);

  // History stacks for undo/redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Load data from localStorage on initialization
  useEffect(() => {
    const savedColumns = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_COLUMNS_KEY)
    ) || [
      { id: "todo", name: "To Do" },
      { id: "in-progress", name: "In Progress" },
      { id: "done", name: "Done" },
    ];
    const savedTasks = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_TASKS_KEY)
    ) || [
      { id: 1, columnId: "todo", title: "Task 1" },
      { id: 2, columnId: "todo", title: "Task 2" },
      { id: 3, columnId: "in-progress", title: "Task 3" },
    ];

    setColumns(savedColumns);
    setTasks(savedTasks);
  }, []);

  // Save columns and tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COLUMNS_KEY, JSON.stringify(columns));
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  }, [columns, tasks]);

  // Save the current state to history
  const saveToHistory = () => {
    setHistory((prev) => [...prev, { columns, tasks }]);
    setRedoStack([]); // Clear redo stack on new action
  };

  // Undo
  const undo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoStack((prev) => [...prev, { columns, tasks }]);
      setColumns(previousState.columns);
      setTasks(previousState.tasks);
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  };

  // Redo
  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setHistory((prev) => [...prev, { columns, tasks }]);
      setColumns(nextState.columns);
      setTasks(nextState.tasks);
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const handleDrop = (draggedTask, targetColumnId) => {
    saveToHistory();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggedTask.id
          ? { ...task, columnId: targetColumnId }
          : task
      )
    );
  };

  const handleRemoveTask = (taskId) => {
    saveToHistory();
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const addTask = (columnId, title) => {
    saveToHistory();
    const newTask = {
      id: Date.now(),
      columnId,
      title,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const addColumn = (name) => {
    saveToHistory();
    const newColumn = {
      id: `col-${Date.now()}`,
      name,
    };
    setColumns((prev) => [...prev, newColumn]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <button
            onClick={() => {
              const name = prompt("Enter column name:");
              if (name) addColumn(name);
            }}
            style={{ padding: "10px", cursor: "pointer", marginRight: "10px" }}
          >
            Add Column
          </button>
          <button
            onClick={undo}
            disabled={history.length === 0}
            style={{
              padding: "10px",
              cursor: history.length > 0 ? "pointer" : "not-allowed",
              background: history.length > 0 ? "#007bff" : "#ccc",
              color: "white",
              marginRight: "10px",
            }}
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            style={{
              padding: "10px",
              cursor: redoStack.length > 0 ? "pointer" : "not-allowed",
              background: redoStack.length > 0 ? "#007bff" : "#ccc",
              color: "white",
            }}
          >
            Redo
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.columnId === column.id)}
            onDrop={handleDrop}
            onRemoveTask={handleRemoveTask}
            onAddTask={() => {
              const title = prompt(`Enter task title for "${column.name}":`);
              if (title) addTask(column.id, title);
            }}
          />
        ))}
      </div>
    </div>
  );
};
