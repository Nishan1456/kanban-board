import "./App.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanBoard } from "./components/KanbanBoard";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>Kanban Board</h1>
        <KanbanBoard />
      </div>
    </DndProvider>
  );
}

export default App;
