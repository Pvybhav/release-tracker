import { useEffect, useState } from "react";
import ChartView from "./ChartView";
import Header from "./Header";
import ListView from "./ListView";
import Boards from "../Board";
import { useParams } from "react-router";

const ADDITIONAL_STAGES = 3;
const ADDITIONAL_STEP_NAMES = ["PR-IP", "FR", "QG"];

function SprintView() {
  const { boardName } = useParams();

  const [selectedCard, setSelectedCard] = useState(null);
  const [sprintDetails, setSprintDetails] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/getSprintDetails?boardName=${boardName}`)
      .then((response) => response.json())
      .then((data) => {
        setSprintDetails(data);
      })
      .catch((err) => console.error(err));
  }, [boardName]);

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

export default SprintView;
