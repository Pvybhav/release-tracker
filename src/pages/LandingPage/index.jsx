import { useEffect, useState } from "react";
import ChartView from "./ChartView";
import Header from "./Header";
import ListView from "./ListView";

const ADDITIONAL_STAGES = 3;
const ADDITIONAL_STEP_NAMES = ["PR-IP", "FR", "QG"];

function LandingPage() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [sprintDetails, setSprintDetails] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/getSprintDetails`)
      .then((response) => response.json())
      .then((data) => {
        setSprintDetails(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header sprintDetails={sprintDetails} />
      <div className="flex w-full gap-4">
        <div
          className={`transition-all duration-500 ease-in-out ${
            selectedCard?.teamName ? "w-1/2" : "w-full"
          }`}
        >
          <ListView
            sprintDetails={sprintDetails}
            additionalStages={ADDITIONAL_STAGES}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            additionalStepNames={ADDITIONAL_STEP_NAMES}
          />
        </div>
        {selectedCard?.teamName && (
          <div
            className={`transition-all duration-500 ease-in-out ${
              selectedCard?.teamName ? "w-1/2" : ""
            }`}
          >
            <ChartView
              selectedCard={selectedCard}
              additionalStages={ADDITIONAL_STAGES}
              additionalStepNames={ADDITIONAL_STEP_NAMES}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
