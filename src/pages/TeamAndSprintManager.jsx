import React, { useContext, useEffect, useState } from "react";
import AddNewTeam from "./AddNewTeam";
import TeamList from "./TeamList";
import AddNewSprint from "./AddNewSprint";
import { BoardContext } from "../main";
import { useParams } from "react-router";
import { NavLink } from "react-router";
import { CogIcon } from "../icons/CogIcon";
import { HomeIcon } from "../icons/HomeIcon";
// import SprintList from "./SprintList";

function TeamAndSprintManager() {
  const boardDetails = useContext(BoardContext);

  const { boardName } = useParams();

  useEffect(() => {
    if (boardName) {
      boardDetails?.setBoardName(boardName);
    }
  }, [boardDetails, boardName]);

  const [refreshRequired, setRefreshRequired] = useState(true);
  const [teams, setTeams] = useState([]);
  const [sprints, setSprints] = useState([
    {
      id: crypto.randomUUID(),
      name: "Sprint-1",
      startDate: new Date(),
      endDate: new Date(),
      editing: false,
    },
    {
      id: crypto.randomUUID(),
      name: "Sprint-2",
      startDate: new Date(),
      endDate: new Date(),
      editing: false,
    },
    {
      id: crypto.randomUUID(),
      name: "Sprint-3",
      startDate: new Date(),
      endDate: new Date(),
      editing: false,
    },
  ]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/team?boardName=${boardName}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setTeams(data);
        setRefreshRequired(false);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
    fetchTeams();
    setRefreshRequired(false);
  }, [refreshRequired]);

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-2 mt-2 text-white bg-blue-500 rounded-xl">
        <h1 className="mx-auto text-xl font-bold">Release Tracker</h1>

        <NavLink
          to={`/${boardName}/manage-team`}
          className="flex items-center justify-end mx-2 text-white hover:text-yellow-300 hover:underline"
        >
          <CogIcon className="w-5 h-5" />
          <span>Manage Team</span>
        </NavLink>

        <div className="w-px h-5 mx-2 bg-white" />

        <NavLink
          to="/"
          className="flex items-center justify-end px-2 text-white hover:text-yellow-300 hover:underline"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
      </header>
      <div className="grid w-full grid-cols-12 gap-2">
        <div className="col-span-4">
          <div>
            <AddNewTeam
              teams={teams}
              setTeams={setTeams}
              setRefreshRequired={setRefreshRequired}
            />
          </div>
          <div className="mt-2">
            <AddNewSprint
              sprints={sprints}
              setSprints={setSprints}
              boardName={boardName}
            />
          </div>
        </div>
        <div className="col-span-8 mt-4 bg-gray-100 rounded-lg">
          <TeamList
            teams={teams}
            setTeams={setTeams}
            refreshRequired={refreshRequired}
            setRefreshRequired={setRefreshRequired}
          />
          {/* <SprintList sprints={sprints} setSprints={setSprints} /> */}
        </div>
      </div>
    </div>
  );
}

export default TeamAndSprintManager;
