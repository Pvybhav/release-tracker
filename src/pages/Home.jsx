import React from "react";
import ListView from "./ListView";

function Home(props) {
  const [selectedItem, setSelectedItem] = useState(null);

  const teamCards = [
    {
      teamName: "Team A",
      currentStatus: "In Progress",
      pendingSteps: ["Step 1", "Step 2"],
    },
    {
      teamName: "Team B",
      currentStatus: "Waiting",
      pendingSteps: ["Step 1", "Step 2", "Step 3"],
    },
    {
      teamName: "Team C",
      currentStatus: "Done",
      pendingSteps: [],
    },
  ];

  return (
    <div>
      {teamCards.map((card) => (
        <div className="card" key={card.teamName}>
          <div className="card-header">
            <span className="team-name">{card.teamName}</span>
            <span className="current-status">{card.currentStatus}</span>
          </div>
          <div className="card-body">
            {card.pendingSteps.map((step) => (
              <div key={step}>{step}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
