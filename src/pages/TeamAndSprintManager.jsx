import React, { useState } from "react";
import AddNewTeam from "./AddNewTeam";
import TeamList from "./TeamList";
import AddNewSprint from "./AddNewSprint";
import SprintList from "./SprintList";
import TeamData from "../data/TeamData";

const addIds = (teams) =>
  teams.map((team) => ({ ...team, id: crypto.randomUUID(), editing: false }));

function TeamAndSprintManager(props) {
  const [teams, setTeams] = useState(() => addIds(TeamData));
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
  return (
    <div className="grid grid-cols-12 gap-2 w-full">
      <div className="col-span-4">
        <div>
          <AddNewTeam teams={teams} setTeams={setTeams} />
        </div>
        <div className="mt-4">
          <AddNewSprint sprints={sprints} setSprints={setSprints} />
        </div>
      </div>
      <div className="col-span-8 bg-gray-100">
        <TeamList teams={teams} setTeams={setTeams} />
        <SprintList sprints={sprints} setSprints={setSprints} />
      </div>
    </div>
  );
}

export default TeamAndSprintManager;
