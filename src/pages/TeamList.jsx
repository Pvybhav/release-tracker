import { Fragment, useEffect, useRef } from "react";
import { TrashIcon } from "../icons/TrashIcon";
import { PencilSquareIcon } from "../icons/PencilSquareIcon";
import { Save } from "../icons/Save";
import { useState } from "react";

function TeamList({ teams, setTeams }) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const inputRef = useRef({});

  const startEditing = (id) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, editing: true } : team
      )
    );
  };

  const stopEditing = (id) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, editing: false } : team
      )
    );
  };

  const updateTeam = (id, updatedTeam) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, ...updatedTeam } : team
      )
    );
  };

  const changeTeam = (id, delta) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, noOfPRs: team.noOfPRs + delta } : team
      )
    );
  };

  const deleteTeam = (id) => {
    setIsOpen(true);
    setTeamToDelete(id);
  };

  const confirmDelete = () => {
    setTeams((prevTeams) =>
      prevTeams.filter((team) => team.id !== teamToDelete)
    );
    setIsOpen(false);
  };

  const cancelDelete = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        const editingTeam = teams.find((team) => team.editing);
        if (editingTeam) {
          stopEditing(editingTeam.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [teams, stopEditing]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Teams</h1>
      {teams.length === 0 ? (
        <p className="text-gray-500 text-lg">No teams available.</p>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-5 items-center border-b border-gray-200 py-2">
            <div className="font-bold text-left pl-6">Team Name</div>
            <div className="font-bold">Number of Pull Requests</div>
            <div className="font-bold">Current Step</div>
            <div className="font-bold">Actions</div>
          </div>
          <ul className="w-full">
            {teams.map((team, index) => (
              <li
                key={team.id}
                className={`border-b border-gray-200 py-4 ${
                  index === teams.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="grid grid-cols-5 items-center">
                  <div className="flex-1 transition-all duration-300 ease-in-out">
                    {team.editing ? (
                      <input
                        type="text"
                        value={team.teamName}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) =>
                          updateTeam(team.id, {
                            teamName: e.target.value,
                          })
                        }
                        ref={(el) => (inputRef.current[team.id] = el)}
                      />
                    ) : (
                      <h2 className="text-lg font-bold text-left pl-6">
                        {team.teamName}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {/* <button
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-l"
                      onClick={() => changeTeam(team.id, -1)}
                    >
                      -
                    </button> */}
                    {team.editing ? (
                      <input
                        type="number"
                        value={team.noOfPRs}
                        className="w-12 text-center"
                        onChange={(e) =>
                          updateTeam(team.id, {
                            noOfPRs: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <div className="px-2 py-1">{team.noOfPRs}</div>
                    )}
                    {/* <button
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-r"
                      onClick={() => changeTeam(team.id, 1)}
                    >
                      +
                    </button> */}
                  </div>
                  <div className="flex items-center justify-center">
                    {/* <button
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-l"
                      onClick={() =>
                        updateTeam(team.id, {
                          currentStep: team.currentStep - 1,
                        })
                      }
                    >
                      -
                    </button> */}
                    {team.editing ? (
                      <input
                        type="number"
                        value={team.currentStep}
                        className="w-12 text-center"
                        onChange={(e) =>
                          updateTeam(team.id, {
                            currentStep: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <div className="px-2 py-1">{team.currentStep}</div>
                    )}
                    {/* <button
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-r"
                      onClick={() =>
                        updateTeam(team.id, {
                          currentStep: team.currentStep + 1,
                        })
                      }
                    >
                      +
                    </button> */}
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      className={`${
                        team.editing ? "bg-green-500" : "bg-blue-500"
                      } hover:bg-green-700 text-white px-2 py-1 rounded transition-all duration-300 ease-in-out`}
                      onClick={() =>
                        team.editing
                          ? stopEditing(team.id)
                          : startEditing(team.id)
                      }
                    >
                      {team.editing ? (
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
                    {!team.editing && (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded transition-all duration-300 ease-in-out ml-2"
                        onClick={() => deleteTeam(team.id)}
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

export default TeamList;
