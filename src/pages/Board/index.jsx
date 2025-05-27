import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { HomeIcon } from "../../icons/HomeIcon";

function Board({ title, description }) {
  return (
    <NavLink
      to={`/board/${title}`}
      className="flex flex-col p-4 bg-white rounded-lg shadow-lg min-w-80 hover:bg-gray-100"
    >
      <div className="flex flex-col items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </NavLink>
  );
}

function Boards() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:3000/boards");
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
    fetchBoards();
  }, []);

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

  const handleAddBoardSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/addBoard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBoard),
      });

      const addedBoard = await response.json();

      if (addedBoard.error) {
        throw new Error(addedBoard.error);
      } else if (!response.ok) {
        throw new Error("Failed to add board");
      } else {
        setBoards([...boards, addedBoard]);
        toast.success("Board added successfully");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setNewBoard({ title: "", description: "" });
      setShowAddBoardForm(false);
    }
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
    <div>
      <header className="flex items-center justify-between px-4 py-2 mt-2 text-white bg-blue-500 rounded-xl">
        <h1 className="mx-auto text-xl font-bold">Release Tracker</h1>

        <div className="w-px h-5 mx-2 bg-white" />

        <NavLink
          to="/"
          className="flex items-center justify-end px-2 text-white hover:text-yellow-300 hover:underline"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
      </header>
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
    </div>
  );
}

export default Boards;
