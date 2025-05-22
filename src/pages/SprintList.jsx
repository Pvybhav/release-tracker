import { Fragment, useEffect, useRef } from "react";
import { TrashIcon } from "../icons/TrashIcon";
import { PencilSquareIcon } from "../icons/PencilSquareIcon";
import { Save } from "../icons/Save";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function SprintList({ sprints, setSprints }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sprintToDelete, setSprintToDelete] = useState(null);

  const inputRef = useRef({});

  const startEditing = (id) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint.id === id ? { ...sprint, editing: true } : sprint
      )
    );
  };

  const stopEditing = (id) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint.id === id ? { ...sprint, editing: false } : sprint
      )
    );
  };

  const updateSprint = (id, updatedSprint) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint.id === id ? { ...sprint, ...updatedSprint } : sprint
      )
    );
  };

  const changeSprintDate = (id, field, value) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint.id === id ? { ...sprint, [field]: value } : sprint
      )
    );
  };

  const deleteSprint = (id) => {
    setIsOpen(true);
    setSprintToDelete(id);
  };

  const confirmDelete = () => {
    setSprints((prevSprints) =>
      prevSprints.filter((sprint) => sprint.id !== sprintToDelete)
    );
    setIsOpen(false);
  };

  const cancelDelete = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        const editingSprint = sprints.find((sprint) => sprint.editing);
        if (editingSprint) {
          stopEditing(editingSprint.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sprints, stopEditing]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Sprints</h1>
      {sprints.length === 0 ? (
        <p className="text-gray-500 text-lg">No sprints available.</p>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-4 items-center border-b border-gray-200 py-2">
            <div className="font-bold">Sprint Name</div>
            <div className="font-bold">Start Date</div>
            <div className="font-bold">End Date</div>
            <div className="font-bold">Actions</div>
          </div>
          <ul className="w-full">
            {sprints.map((sprint, index) => (
              <li
                key={sprint.id}
                className={`border-b border-gray-200 py-4 ${
                  index === sprints.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="grid grid-cols-4 items-center">
                  <div className="flex-1 transition-all duration-300 ease-in-out">
                    {sprint.editing ? (
                      <input
                        type="text"
                        value={sprint.name}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) =>
                          updateSprint(sprint.id, { name: e.target.value })
                        }
                        ref={(el) => (inputRef.current[sprint.id] = el)}
                      />
                    ) : (
                      <h2 className="text-lg font-bold">{sprint.name}</h2>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {sprint.editing ? (
                      <DatePicker
                        selected={sprint.startDate}
                        onChange={(date) =>
                          changeSprintDate(sprint.id, "startDate", date)
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="px-2 py-1">
                        {moment(sprint.startDate).format("MMMM Do YYYY")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {sprint.editing ? (
                      <DatePicker
                        selected={sprint.endDate}
                        onChange={(date) =>
                          changeSprintDate(sprint.id, "endDate", date)
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="px-2 py-1">
                        {moment(sprint.endDate).format("MMMM Do YYYY")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      className={`${
                        sprint.editing ? "bg-green-500" : "bg-blue-500"
                      } hover:bg-green-700 text-white px-2 py-1 rounded transition-all duration-300 ease-in-out`}
                      onClick={() =>
                        sprint.editing
                          ? stopEditing(sprint.id)
                          : startEditing(sprint.id)
                      }
                    >
                      {sprint.editing ? (
                        <span className="flex items-center gap-1">
                          <Save className="w-5 h-5" />
                          Update
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <PencilSquareIcon className="w-5 h-5" />
                          Edit
                        </span>
                      )}
                    </button>
                    {!sprint.editing && (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded transition-all duration-300 ease-in-out ml-2"
                        onClick={() => deleteSprint(sprint.id)}
                      >
                        <span className="flex items-center gap-1">
                          <TrashIcon className="w-5 h-5" />
                          Delete
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <span className="inline-block h-screen align-middle" />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-gray-100 shadow-xl rounded-2xl">
              <div className="text-lg font-bold leading-6 text-red-600">
                Confirm Delete
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this team?
                </p>
              </div>
              <div className="mt-4 flex gap-2 justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={confirmDelete}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SprintList;
