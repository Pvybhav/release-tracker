import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { BoardContext } from "../main";

function AddNewTeam({ setRefreshRequired }) {
  const boardDetails = useContext(BoardContext);

  const [formData, setFormData] = useState({
    teamName: "",
    noOfPRs: "",
    currentStep: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/team?boardName=${boardDetails?.boardName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      const addedTeam = await response.json();

      if (addedTeam.error) {
        throw new Error(addedTeam.error);
      } else if (!response.ok) {
        throw new Error("Failed to add board");
      } else {
        setFormData({
          teamName: "",
          noOfPRs: "",
          currentStep: 1,
        });
        setRefreshRequired(true);
        toast.success("Team added successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClear = () => {
    setFormData({
      teamName: "",
      noOfPRs: "",
      currentStep: 1,
    });
  };

  const handleNoOfPRsChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      return;
    }

    setFormData({ ...formData, noOfPRs: value });
  };

  return (
    <div className="flex items-center justify-center py-2 h-fit">
      <div className="flex flex-col justify-center w-full max-w-full mx-5 my-auto overflow-hidden bg-gray-100 rounded-lg shadow-md h-fit">
        <div className="px-4 py-1">
          <h2 className="text-lg font-bold text-gray-800">Add New Team</h2>
        </div>
        {/* <hr className="w-full my-2 border-t-2 border-gray-400 border-dashed" /> */}
        <form className="px-4 py-2" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="teamName"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="currentStep"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              Current Step
            </label>
            <input
              type="number"
              id="currentStep"
              value={formData.currentStep}
              onChange={(e) =>
                setFormData({ ...formData, currentStep: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Current Step"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="noOfPRs"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              Number of PR's
            </label>
            <input
              type="number"
              id="noOfPRs"
              value={formData.noOfPRs}
              onChange={handleNoOfPRsChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Team
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewTeam;
