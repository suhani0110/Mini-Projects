import { useState } from "react";
import "./todolist.css";

function TodoList() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  function addItem() {
    if (text.trim() !== "") {
      setItems([...items, { name: text, done: false }]);
      setText("");
    }
  }

  function toggleDone(index) {
    setItems(
      items.map((item, i) =>
        i === index && !item.done ? { ...item, done: true } : item
      )
    );
  }

  function deleteItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (

      <div className="todo-container">
        <div className="todo-heading">
          <h2>To Do List</h2>
        </div>
        <div className="todo-input-row">
          <input
            className="todo-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..." />
          <button className="todo-add-btn" onClick={addItem}>
            Add
          </button>
        </div>
        <div className="todo-table">
          <div className="todo-table-header">
            <span>Work Name</span>
            <span>Task State</span>
            <span>Done?</span>
            <span>Delete</span>
          </div>
          {items.map((item, i) => (
            <div className="todo-table-row" key={i}>
              <span>{item.name}</span>
              <span>{item.done ? "Completed" : "Pending"}</span>
              <input
                type="checkbox"
                checked={item.done}
                disabled={item.done}
                onChange={() => toggleDone(i)} />
              <button className="todo-delete-btn" onClick={() => deleteItem(i)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
  );
}

export default TodoList;
