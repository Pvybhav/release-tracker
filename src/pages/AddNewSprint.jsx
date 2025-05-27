import { useEffect, useState } from "react";
import Select from "react-select";
import { NavLink } from "react-router";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BoardContext } from "../main";

function AddNewSprint({ boardName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    fetch(`http://localhost:3000/getSprintDetails?boardName=${boardName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.name) {
          setIsEditing(true);
        }
        setFormData(data);
      })
      .catch((err) => console.error(err));
  }, [boardName]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const existingTeam = sprints.find((team) => team.name === formData.name);
  //   if (existingTeam) {
  //     toast.error("Same Team already exists. Please choose different name.");
  //     return;
  //   }
  //   setSprints((prevTeams) => [...prevTeams, formData]);

  //   setFormData({
  //     name: "",
  //     startDate: formData.startDate.toDateString(),
  //     endDate: formData.endDate.toDateString(),
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/addSprintName?boardName=${boardName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save sprint details");
      }

      // const newTeam = await response.json();
      // setTeams((prevTeams) => [...prevTeams, newTeam]);
      // setFormData({
      //   name: "",
      //   startDate: formData.startDate,
      //   endDate: formData.endDate,
      // });
      toast.success(
        `Sprint details ${isEditing ? "updated" : "added"} successfully`
      );
      setIsEditing(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const handleClear = () => {
  //   setFormData({
  //     name: "",
  //     startDate: new Date(),
  //     endDate: new Date(),
  //   });
  // };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-center w-full h-full max-w-full mx-5 my-auto overflow-hidden bg-gray-100 rounded-lg shadow-md">
        <div className="px-4 py-1">
          <h2 className="text-lg font-bold text-gray-800">
            {isEditing ? "Edit Sprint Details" : "Add Sprint Details"}
          </h2>
        </div>
        {/* <hr className="w-full my-2 border-t-2 border-gray-400 border-dashed" /> */}

        <form className="px-4 py-2" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              Sprint Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Sprint Name"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="number"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              Sprint Number
            </label>
            <input
              type="number"
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Sprint Number"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="startDate"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              Start Date
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="endDate"
              className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
            >
              End Date
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isEditing ? "Update Sprint" : "Add Sprint"}
            </button>
            {/* <button
              type="button"
              onClick={handleClear}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Clear
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewSprint;
