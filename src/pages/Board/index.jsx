import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Board({ title, description }) {
  return (
    <NavLink
      to={`/board/${title}`}
      className="flex flex-col p-4 bg-white rounded-lg shadow-lg"
    >
      <div className="flex flex-col items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </NavLink>
  );
}

function Boards() {
  const [boards, setBoards] = useState([
    {
      id: crypto.randomUUID(),
      title: "Board-1",
      description: "Board-1 description",
    },
    {
      id: crypto.randomUUID(),
      title: "Board-2",
      description: "Board-2 description",
    },
    {
      id: crypto.randomUUID(),
      title: "Board-3",
      description: "Board-3 description",
    },
  ]);

  const [newBoard, setNewBoard] = useState({ title: "", description: "" });
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addBoard = () => {
    setShowAddBoardForm(true);
    setIsAuthenticated(false);
  };

  const handleNewBoardChange = (e) => {
    setNewBoard({ ...newBoard, [e.target.name]: e.target.value });
  };

  const handleAddBoardSubmit = (e) => {
    e.preventDefault();
    const newBoardId = crypto.randomUUID();
    setBoards([...boards, { id: newBoardId, ...newBoard }]);
    setNewBoard({ title: "", description: "" });
    setShowAddBoardForm(false);
  };

  const cancelAddBoard = () => {
    setNewBoard({ title: "", description: "" });
    setShowAddBoardForm(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "password") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center m-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {boards.map(({ id, title, description }) => (
          <Board key={id} title={title} description={description} id={id} />
        ))}
      </div>
      {showAddBoardForm ? (
        !isAuthenticated ? (
          <form
            className="flex flex-col items-center mt-4"
            onSubmit={handlePasswordSubmit}
          >
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              className="px-4 py-2 mb-2 border border-gray-300 rounded-lg"
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-lg"
              >
                Authenticate
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-red-500 rounded-lg"
                onClick={cancelAddBoard}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form
            className="flex flex-col items-center mt-4"
            onSubmit={handleAddBoardSubmit}
          >
            <input
              type="text"
              name="title"
              value={newBoard.title}
              onChange={handleNewBoardChange}
              placeholder="Enter board title"
              className="px-4 py-2 mb-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="description"
              value={newBoard.description}
              onChange={handleNewBoardChange}
              placeholder="Enter board description"
              className="px-4 py-2 mb-2 border border-gray-300 rounded-lg"
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-lg"
              >
                Add Board
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-red-500 rounded-lg"
                onClick={cancelAddBoard}
              >
                Cancel
              </button>
            </div>
          </form>
        )
      ) : (
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
          onClick={addBoard}
        >
          Add Board
        </button>
      )}
    </div>
  );
}

export default Boards;
