import React, { useState, useEffect } from "react";
// import { CogIcon } from "../icons/CogIcon";
// import { NavLink } from "react-router";
import UseAnimations from "react-useanimations";
import arrowDown from "react-useanimations/lib/arrowDown";
import arrowUp from "react-useanimations/lib/arrowUp";
// import TeamData from "../data/TeamData";

function ListView({
  sprintDetails = {},
  setSelectedCard = () => {},
  additionalStages,
  selectedCard = {},
  additionalStepNames = [],
}) {
  const [teamCards, setTeamCards] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/team`)
      .then((response) => response.json())
      .then((data) => {
        setTeamCards(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // const additionalStages = 3;
  // const teamCards = TeamData;

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleStage = (cardDetails) => {
    return Array.from(
      { length: cardDetails.noOfPRs + additionalStages },
      (_, seriesIndex) => {
        switch (seriesIndex) {
          case cardDetails.noOfPRs + additionalStages - 1:
            return additionalStepNames.at(-1);
          case cardDetails.noOfPRs + additionalStages - 2:
            return additionalStepNames.at(-2);
          case cardDetails.noOfPRs + additionalStages - 3:
            return additionalStepNames.at(-3);
          default:
            return `Pre-Release - ${seriesIndex + 1}`;
        }
      }
    )[cardDetails.currentStep - 1];
  };

  const fillColorGreen = "green";
  const fillColorRed = "red";

  const gridTemplateColumns = selectedCard?.teamName
    ? "repeat(2, minmax(0, 1fr)"
    : "repeat(3, minmax(0, 1fr)";

  if (teamCards?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg py-28">
          <p className="text-3xl font-bold text-center">No teams found</p>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col w-full h-[75vh]">
      {/* <div className="flex justify-end text-right">
        <NavLink
          to="/manage-team"
          className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          <CogIcon className="w-6 h-6" />
          <span>Manage Team</span>
        </NavLink>
      </div> */}
      <div className="flex flex-row w-full">
        <div className={`flex flex-col w-full mx-4`}>
          {teamCards.map(
            (card, index) =>
              index % (selectedCard?.teamName ? 2 : 3) === 0 && (
                <div
                  className="grid grid-cols-2 gap-4"
                  key={index}
                  style={{ gridTemplateColumns }}
                >
                  {teamCards
                    .slice(index, index + (selectedCard?.teamName ? 2 : 3))
                    .map((card) => (
                      <div
                        className={`card cursor-pointer shadow-md hover:shadow-lg transition duration-300 ease-in-out border border-gray-200 rounded-lg p-2 m-2 w-full ${
                          selectedCard?.teamName === card.teamName
                            ? "bg-blue-50 border-blue-800 shadow-xl hover:bg-blue-100"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        key={card.teamName}
                        onClick={() => handleCardClick(card)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="text-xl font-bold text-gray-600 uppercase">
                              {card.teamName}
                            </div>
                            <div className="text-sm font-bold text-gray-600 uppercase">
                              {handleStage(card)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {card.currentStep >
                              Number(sprintDetails.sprintName) && (
                              <UseAnimations
                                animation={arrowUp}
                                size={36}
                                strokeColor={fillColorGreen}
                                autoplay={false}
                              />
                            )}
                            {card.currentStep <
                              Number(sprintDetails.sprintName) && (
                              <UseAnimations
                                animation={arrowDown}
                                size={36}
                                strokeColor={fillColorRed}
                                autoplay={false}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default ListView;
