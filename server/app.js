const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { readFileSync, writeFileSync } = require("fs");
const app = express();
const teamsJSON = "./teams.json";
const sprintsJSON = "./sprints.json";
const singleSprintsJSON = "./singleSprintsJSON.json";

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

ensureFileExists(teamsJSON, []);
ensureFileExists(sprintsJSON, []);

const safeJSONParse = (filePath) => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`Error parsing JSON from ${filePath}: ${err.message}`);
    return null;
  }
};

app.get("/", (req, res) => {
  const teams = safeJSONParse(teamsJSON);
  const sprints = safeJSONParse(sprintsJSON);
  if (teams === null || sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  res.send({ teams, sprints });
});

app.get("/team", (req, res) => {
  const teams = safeJSONParse(teamsJSON);
  if (teams === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  res.send(teams);
});

app.post("/team", (req, res) => {
  const teams = safeJSONParse(teamsJSON);
  if (teams === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const newTeam = req.body;
  const existingTeam = teams.find((team) => team.teamName === newTeam.teamName);
  if (existingTeam) {
    res.status(400).send({
      error: "Team name already exists. Please choose a different name.",
    });
    return;
  }
  teams.push({
    ...(newTeam || {}),
    id: crypto.randomUUID(),
    currentStep: 1,
    editing: false,
  });
  try {
    writeFileSync(teamsJSON, JSON.stringify(teams));
    res.send(newTeam);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.put("/team/:id", (req, res) => {
  const teams = safeJSONParse(teamsJSON);
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
    writeFileSync(teamsJSON, JSON.stringify(teams));
    res.send(updatedTeam);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.delete("/team/:id", (req, res) => {
  const teams = safeJSONParse(teamsJSON);
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
    writeFileSync(teamsJSON, JSON.stringify(teams));
    res.send({ message: "Team deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.get("/sprint", (req, res) => {
  const sprints = safeJSONParse(sprintsJSON);
  if (sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  res.send(sprints);
});

app.post("/sprint", (req, res) => {
  const sprints = safeJSONParse(sprintsJSON);
  if (sprints === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const newSprint = req.body;
  sprints.push(newSprint);
  try {
    writeFileSync(sprintsJSON, JSON.stringify(sprints));
    res.send(newSprint);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.put("/sprint/:id", (req, res) => {
  const sprints = safeJSONParse(sprintsJSON);
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
    writeFileSync(sprintsJSON, JSON.stringify(sprints));
    res.send(updatedSprint);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.delete("/sprint/:id", (req, res) => {
  const sprints = safeJSONParse(sprintsJSON);
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
    writeFileSync(sprintsJSON, JSON.stringify(sprints));
    res.send({ message: "Sprint deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

ensureFileExists(singleSprintsJSON, {});

app.put("/addSprintName/:sprintName", (req, res) => {
  const singleSprintJSON = safeJSONParse(singleSprintsJSON);
  if (singleSprintJSON === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
  const sprintName = req.params.sprintName;

  const updatedSprint = { ...req.body, sprintName };

  console.log(updatedSprint);
  try {
    writeFileSync(singleSprintsJSON, JSON.stringify(updatedSprint));
    res.send(updatedSprint);
  } catch (err) {
    res.status(500).send({ error: "Failed to write to file" });
  }
});

app.get("/getSprintDetails", (req, res) => {
  const singleSprintJSON = safeJSONParse(singleSprintsJSON);
  if (singleSprintJSON === null) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }

  res.send(singleSprintJSON);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
