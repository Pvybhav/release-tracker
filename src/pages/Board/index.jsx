import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HomeIcon } from "../../icons/HomeIcon";
import AppHeader from "../../Components/AppHeader";
import NoBoardsImage from "../../assets/no-boards.png";
import Modal from "../../Components/Modal";
import { toast } from "react-toastify";
import { BoardContext } from "../../main";

function Board({ title, description, password }) {
  const navigate = useNavigate();
  const boardDetails = useContext(BoardContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
    setIsPasswordValid(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword !== password) {
      setIsPasswordValid(false);
      return;
    }
    setIsModalOpen(false);
    const boardPath = `/board/${title}`;
    boardDetails?.setBoardName(title);
    navigate(boardPath);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="flex flex-col p-4 bg-white rounded-lg shadow-lg cursor-pointer min-w-80 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          handleCancel={() => setIsModalOpen(false)}
          submitButtonText="Open"
          handleSubmit={handlePasswordSubmit}
          title="Enter Board Password To View Board"
        >
          <form
            className="flex flex-col items-center mt-4"
            onSubmit={handlePasswordSubmit}
          >
            {!isPasswordValid && (
              <p className="mt-2 mb-4 text-center text-red-500">
                The password is incorrect. Please try again.
              </p>
            )}

            <input
              type="password"
              value={enteredPassword}
              onChange={handlePasswordChange}
              placeholder="Enter Board Password"
              autoComplete="off"
              className={`w-full px-4 py-2 border ${
                isPasswordValid ? "border-gray-300" : "border-red-500"
              } rounded-lg`}
            />
          </form>
        </Modal>
      )}
    </>
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
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const addBoard = () => {
    setIsAddBoardModalOpen(true);
  };

  const handleNewBoardChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setIsTitleValid(true);
    }
    if (name === "description") {
      setIsDescriptionValid(true);
    }
    if (name === "password") {
      setIsPasswordValid(true);
    }
    setNewBoard({ ...newBoard, [name]: value });
  };

  const handleAddBoardSubmit = async (e) => {
    e.preventDefault();
    if (
      newBoard.title.trim().length === 0 ||
      newBoard.description.trim().length === 0 ||
      newBoard.password.trim().length === 0
    ) {
      const { title, description, password } = newBoard;
      if (title.trim().length === 0) {
        setIsTitleValid(false);
      }
      if (description.trim().length === 0) {
        setIsDescriptionValid(false);
      }
      if (password.trim().length === 0) {
        setIsPasswordValid(false);
      }
      return;
    }
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
        setIsAddBoardModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setNewBoard({ title: "", description: "", password: "" });
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
          {boards.map(({ id, title, description, password }) => (
            <Board
              key={id}
              title={title}
              description={description}
              id={id}
              password={password}
            />
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
                className={`w-full px-4 py-2 border ${
                  isTitleValid ? "border-gray-300" : "border-red-500"
                } rounded-lg`}
              />
              <input
                type="text"
                name="description"
                value={newBoard.description}
                onChange={handleNewBoardChange}
                placeholder="Enter Board Description"
                className={`w-full px-4 py-2 mt-2 border ${
                  isDescriptionValid ? "border-gray-300" : "border-red-500"
                } rounded-lg`}
              />
              <input
                type="password"
                name="password"
                value={newBoard.password}
                onChange={handleNewBoardChange}
                placeholder="Enter Board Password"
                autoComplete="off"
                className={`w-full px-4 py-2 mt-2 border ${
                  isPasswordValid ? "border-gray-300" : "border-red-500"
                } rounded-lg`}
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
