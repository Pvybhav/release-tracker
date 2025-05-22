import React, { useState } from "react";
import { NavLink } from "react-router";
import { toast } from "react-toastify";

function AddNewTeam({ teams, setTeams }) {
  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    name: "",
    noOfPRs: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingTeam = teams.find((team) => team.name === formData.name);
    if (existingTeam) {
      toast.error("Same Team already exists. Please choose different name.");
      return;
    }
    console.log(formData);
    setTeams((prevTeams) => [...prevTeams, formData]);
    setFormData({
      id: crypto.randomUUID(),
      name: "",
      noOfPRs: "",
    });
  };

  const handleClear = () => {
    setFormData({
      id: crypto.randomUUID(),
      name: "",
      noOfPRs: "",
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
    <div className="flex justify-center items-center h-fit bg-gray-100">
      <div className="max-w-full w-full h-fit my-auto mx-5 bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col justify-center">
        <div className="px-4 py-1">
          <h2 className="text-lg font-bold text-gray-800">Add New Team</h2>
        </div>
        <form className="px-6 py-2" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
            >
              Team Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="noOfPRs"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
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
