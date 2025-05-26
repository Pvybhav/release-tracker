const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { readFileSync, writeFileSync } = require("fs");
const app = express();
const teamsJSONPath = "./teams.json";
const sprintsJSONPath = "./sprints.json";
const singleSprintJSONPath = "./singleSprint.json";
const boardsJSONPath = "./boards.json";

app.use(express.json());
app.use(cors({ origin: "*" }));

const ensureFileExists = (filePath, defaultContent) => {
  try {
    if (!fs.existsSync(filePath)) {
      writeFileSync(filePath, JSON.stringify(defaultContent));
    }
  } catch (err) {
    console.error(`Error ensuring file exists: ${err.message}`);
  }
};

ensureFileExists(teamsJSONPath, []);
ensureFileExists(sprintsJSONPath, []);

const safeJSONParse = (filePath) => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`Error parsing JSON from ${filePath}: ${err.message}`);
    return null;
  }
};

app.get("/", (req, res) => {
  const teams = safeJSONParse(teamsJSONPath);
  const sprints = safeJSONParse(sprintsJSONPath);
  if (teams === null || sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  res.send({ teams, sprints });
});

app.get("/team", (req, res) => {
  const boards = safeJSONParse(boardsJSONPath);
  if (boards === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }

  const selectedBoard = boards.find(
    (board) => board.title === req.query.boardName
  );

  const teams = selectedBoard?.teams || [];
  res.send(teams);
});

app.post("/team", (req, res) => {
  const boards = safeJSONParse(boardsJSONPath);

  if (boards === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }

  const selectedBoard = boards.find(
    (board) => board.title === req.query.boardName
  );
  console.log({ boards, selectedBoard, params: req.query });

  if (!selectedBoard) {
    res.status(404).send({ error: "Board not found" });
    return;
  }

  const newTeam = req.body;
  const isTeamNameExists = selectedBoard?.teams.find(
    (team) => team.teamName === newTeam.teamName
  );

  if (isTeamNameExists) {
    res.status(400).send({
      error: "Team name already exists. Please choose a different name.",
    });
    return;
  }

  const updatedTeams = [
    ...selectedBoard.teams,
    {
      ...newTeam,
      id: crypto.randomUUID(),
      currentStep: 1,
      editing: false,
    },
  ];

  const udpatedBoard = {
    ...selectedBoard,
    teams: updatedTeams,
  };

  const updatedBoards = boards.map((board) =>
    board.title === selectedBoard.title ? udpatedBoard : board
  );

  try {
    writeFileSync(boardsJSONPath, JSON.stringify(updatedBoards));
    res.send(newTeam);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.put("/team/:id", (req, res) => {
  const teams = safeJSONParse(teamsJSONPath);
  if (teams === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const id = req.params.id;
  const updatedTeam = req.body;
  const index = teams.findIndex((team) => team.id === id);
  if (index === -1) {
    res.status(404).send({ error: "Team not found" });
    return;
  }
  teams[index] = updatedTeam;
  try {
    writeFileSync(teamsJSONPath, JSON.stringify(teams));
    res.send(updatedTeam);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.delete("/team/:id", (req, res) => {
  const teams = safeJSONParse(teamsJSONPath);
  if (teams === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const id = req.params.id;
  const index = teams.findIndex((team) => team.id === id);
  if (index === -1) {
    res.status(404).send({ error: "Team not found" });
    return;
  }
  teams.splice(index, 1);
  try {
    writeFileSync(teamsJSONPath, JSON.stringify(teams));
    res.send({ message: "Team deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.get("/sprint", (req, res) => {
  const sprints = safeJSONParse(sprintsJSONPath);
  if (sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  res.send(sprints);
});

app.post("/sprint", (req, res) => {
  const sprints = safeJSONParse(sprintsJSONPath);
  if (sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const newSprint = req.body;
  sprints.push(newSprint);
  try {
    writeFileSync(sprintsJSONPath, JSON.stringify(sprints));
    res.send(newSprint);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.put("/sprint/:id", (req, res) => {
  const sprints = safeJSONParse(sprintsJSONPath);
  if (sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const id = req.params.id;
  const updatedSprint = req.body;
  const index = sprints.findIndex((sprint) => sprint.id === id);
  if (index === -1) {
    res.status(404).send({ error: "Sprint not found" });
    return;
  }
  sprints[index] = updatedSprint;
  try {
    writeFileSync(sprintsJSONPath, JSON.stringify(sprints));
    res.send(updatedSprint);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.delete("/sprint/:id", (req, res) => {
  const sprints = safeJSONParse(sprintsJSONPath);
  if (sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const id = req.params.id;
  const index = sprints.findIndex((sprint) => sprint.id === id);
  if (index === -1) {
    res.status(404).send({ error: "Sprint not found" });
    return;
  }
  sprints.splice(index, 1);
  try {
    writeFileSync(sprintsJSONPath, JSON.stringify(sprints));
    res.send({ message: "Sprint deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.post("/addBoard", (req, res) => {
  ensureFileExists(boardsJSONPath, []);

  const boards = safeJSONParse(boardsJSONPath);
  if (boards === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const newBoard = req.body;
  const existingBoard = boards.find((board) => board.title === newBoard.title);

  if (existingBoard) {
    res.status(400).send({
      error: "Board name already exists. Please choose a different name.",
    });
    return;
  }
  boards.push({
    ...(newBoard || {}),
    id: crypto.randomUUID(),
  });
  try {
    writeFileSync(boardsJSONPath, JSON.stringify(boards));
    res.send(newBoard);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.get("/boards", (req, res) => {
  ensureFileExists(boardsJSONPath, {});

  const singleSprintJSON = safeJSONParse(boardsJSONPath);
  if (singleSprintJSON === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }

  res.send(singleSprintJSON);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.put("/addSprintName/:sprintName", (req, res) => {
  ensureFileExists(singleSprintJSONPath, {});

  const singleSprintJSON = safeJSONParse(singleSprintJSONPath);
  if (singleSprintJSON === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const sprintName = req.params.sprintName;

  const updatedSprint = { ...req.body, sprintName, id: crypto.randomUUID() };

  try {
    writeFileSync(singleSprintJSONPath, JSON.stringify(updatedSprint));
    res.send(updatedSprint);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.get("/getSprintDetails", (req, res) => {
  ensureFileExists(singleSprintJSONPath, {});

  const singleSprintJSON = safeJSONParse(singleSprintJSONPath);
  if (singleSprintJSON === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }

  res.send(singleSprintJSON);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
