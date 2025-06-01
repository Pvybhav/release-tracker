import React, { useEffect, useState } from "react";
import { NavLink, UNSAFE_decodeViaTurboStream } from "react-router-dom";
import { toast } from "react-toastify";
import { HomeIcon } from "../../icons/HomeIcon";
import AppHeader from "../../Components/AppHeader";
import NoBoardsImage from "../../assets/no-boards.png";
import Modal from "../../Components/Modal";

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

  const [newBoard, setNewBoard] = useState({
    title: "",
    description: "",
    password: "",
  });
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);

  const addBoard = () => {
    setIsAddBoardModalOpen(true);
  };

  const handleNewBoardChange = (e) => {
    setNewBoard({ ...newBoard, [e.target.name]: e.target.value });
  };

  const handleAddBoardSubmit = async (e) => {
    e.preventDefault();
    setIsAddBoardModalOpen(false);
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
    }
  };

  const cancelAddBoard = () => {
    setNewBoard({ title: "", description: "", password: "" });
    setIsAddBoardModalOpen(false);
  };

  return (
    <div>
      <AppHeader createNewBoard={() => addBoard()} showAddBoardLink />
      <div className="flex flex-col items-center m-4">
        {boards?.length === 0 && (
          <div className="flex justify-center">
            <img
              src={NoBoardsImage}
              alt="No Boards Available"
              className="object-contain w-3/4 h-4/5"
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {boards.map(({ id, title, description }) => (
            <Board key={id} title={title} description={description} id={id} />
          ))}
        </div>
        {!isAddBoardModalOpen ? (
          boards?.length === 0 ? (
            <div className="flex flex-row items-center justify-center">
              No boards available. Click&nbsp;
              <span
                onClick={addBoard}
                className="text-blue-500 !underline cursor-pointer hover:text-blue-700 hover:underline"
              >
                Add Board
              </span>
              &nbsp;to add new board
            </div>
          ) : null
        ) : (
          ""
        )}
      </div>
      {isAddBoardModalOpen && (
        <Modal
          open={isAddBoardModalOpen}
          setOpen={setIsAddBoardModalOpen}
          title={"Add New Board"}
          children={
            <form
              className="flex flex-col items-center mt-4"
              onSubmit={handleAddBoardSubmit}
            >
              <input
                type="text"
                name="title"
                value={newBoard.title}
                onChange={handleNewBoardChange}
                placeholder="Enter Board Title"
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="description"
                value={newBoard.description}
                onChange={handleNewBoardChange}
                placeholder="Enter Board Description"
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                name="password"
                value={newBoard.password}
                onChange={handleNewBoardChange}
                placeholder="Enter Board Password"
                autoComplete="off"
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
              />
            </form>
          }
          handleSubmit={handleAddBoardSubmit}
          handleCancel={cancelAddBoard}
        />
      )}
    </div>
  );
}

export default Boards;
