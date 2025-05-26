import { useContext, useEffect, useRef, useState } from "react";
import { TrashIcon } from "../icons/TrashIcon";
import { PencilSquareIcon } from "../icons/PencilSquareIcon";
import { Save } from "../icons/Save";
import { BoardContext } from "../main";

function TeamList({ teams, setTeams }) {
  const boardDetails = useContext(BoardContext);

  const [isOpen, setIsOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);

  const inputRef = useRef({});

  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/team");
  //       const data = await response.json();
  //       setTeams(data);
  //     } catch (error) {
  //       console.error("Failed to fetch teams:", error);
  //     }
  //   };
  //   fetchTeams();
  // }, []);

  const startEditing = (id) => {
    setEditingTeamId(id);
  };

  const stopEditing = async (id) => {
    const editingTeam = teams.find((team) => team.id === id);
    if (!editingTeam) return;

    try {
      const response = await fetch(
        `http://localhost:3000/team/${id}?boardName=${boardDetails.boardName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTeam),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update team");
      }

      const updatedTeam = await response.json();
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === id ? { ...team, ...updatedTeam } : team
        )
      );
      setEditingTeamId(null);
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const updateTeam = (id, updatedTeam) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, ...updatedTeam } : team
      )
    );
  };

  const deleteTeam = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/team/${teamToDelete}?boardName=${boardDetails.boardName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete team");
      }

      setTeams((prevTeams) =>
        prevTeams.filter((team) => team.id !== teamToDelete)
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  const cancelDelete = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        const editingTeam = teams.find((team) => team.id === editingTeamId);
        if (editingTeam) {
          stopEditing(editingTeamId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [teams, editingTeamId, stopEditing]);

  return (
    <div className="flex flex-col items-center p-2">
      <h1 className="text-2xl font-bold">Teams</h1>
      <hr className="w-full my-2 border-t-2 border-gray-400 border-dashed" />

      {teams.length === 0 ? (
        <p className="text-lg text-gray-500">No teams available.</p>
      ) : (
        <div className="w-full">
          <div className="grid items-center grid-cols-4 py-2 border-b border-gray-200">
            <div className="pl-6 font-bold text-left">Team Name</div>
            <div className="font-bold">Number of Pre Releases</div>
            <div className="font-bold">Current Step</div>
            <div className="font-bold">Actions</div>
          </div>
          <ul className="w-full max-h-[70vh] overflow-y-scroll">
            {teams.map((team, index) => (
              <li
                key={team.id}
                className={`border-b border-gray-300 py-4 ${
                  index === teams.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="grid items-center grid-cols-4">
                  <div className="flex-1 transition-all duration-300 ease-in-out">
                    {editingTeamId === team.id ? (
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
                      <h2 className="pl-6 text-lg font-bold text-left">
                        {team.teamName}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {editingTeamId === team.id ? (
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
                  </div>
                  <div className="flex items-center justify-center">
                    {editingTeamId === team.id ? (
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
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className={`${
                        editingTeamId === team.id
                          ? "bg-green-500"
                          : "bg-blue-500"
                      } hover:bg-green-700 text-white px-2 py-1 rounded transition-all duration-300 ease-in-out`}
                      onClick={() =>
                        editingTeamId === team.id
                          ? stopEditing(team.id)
                          : startEditing(team.id)
                      }
                    >
                      {editingTeamId === team.id ? (
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
                    {editingTeamId !== team.id && (
                      <button
                        className="px-2 py-1 ml-2 text-white transition-all duration-300 ease-in-out bg-red-500 rounded hover:bg-red-700"
                        onClick={() => {
                          setTeamToDelete(team.id);
                          setIsOpen(true);
                        }}
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
              <div className="flex justify-center gap-2 mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={deleteTeam}
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
