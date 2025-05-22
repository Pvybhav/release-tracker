import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ChevronDoubleUpIcon } from "../icons/ChevronDoubleUpIcon";
import { ChevronDoubleDownIcon } from "../icons/ChevronDoubleDownIcon";
import { CogIcon } from "../icons/CogIcon";
import { NavLink } from "react-router";
import UseAnimations from "react-useanimations";
import arrowDown from "react-useanimations/lib/arrowDown";
import arrowUp from "react-useanimations/lib/arrowUp";
import TeamData from "../data/TeamData";

const additionalStepNames = ["PR-IP", "FR", "QC"];
function ListView() {
  const resizeRef = useRef(false);
  const chartRef = useRef();
  const [currentSprint, setCurrentSprint] = useState(2);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    dataLabels: {
      enabled: false,
    },
    series: [],
    labels: [],
    legend: {
      customLegendItems: [],
      showForSingleSeries: true,
    },
    colors: ["#008000", "#FFA500", "#808080"],
  });
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (selectedCard) {
      const seriesOptions = new Array(
        selectedCard.noOfPRs + additionalStages
      ).fill(100 / (selectedCard.noOfPRs + additionalStages));
      const lastColor = chartOptions.colors[chartOptions.colors.length - 1];
      const updatedOptions = {
        ...chartOptions,
        series: seriesOptions,
        labels: Array.from(
          { length: selectedCard.noOfPRs + additionalStages },
          (_, seriesIndex) => {
            switch (seriesIndex) {
              case seriesOptions.length - 1:
                return additionalStepNames.at(-1);
              case seriesOptions.length - 2:
                return additionalStepNames.at(-2);
              case seriesOptions.length - 3:
                return additionalStepNames.at(-3);
              default:
                return `PR - ${seriesIndex + 1}`;
            }
          }
        ),
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            console.log(series, seriesIndex, dataPointIndex, w);
            // return "In progress";
            return `${w.config.labels[seriesIndex]}`;
          },
        },
        dataLabels: {
          text: "",
          enabled: true,
          formatter: function (value, { seriesIndex }) {
            switch (seriesIndex) {
              case seriesOptions.length - 1:
                return additionalStepNames.at(-1);
              case seriesOptions.length - 2:
                return additionalStepNames.at(-2);
              case seriesOptions.length - 3:
                return additionalStepNames.at(-3);
              default:
                return `PR - ${seriesIndex + 1}`;
            }
          },
        },
        legend: {
          customLegendItems: ["Completed", "Pending", "In Progress"],
          showForSingleSeries: true,
          position: "bottom",
        },
        colors: [
          function ({ value, seriesIndex, w }) {
            if (seriesIndex + 1 < selectedCard.currentStep) {
              return "#008000";
            } else if (seriesIndex + 1 > selectedCard.currentStep) {
              return "#808080";
            } else {
              return "#FFA500";
            }
          },
        ],
      };

      setChartOptions(updatedOptions);
      setChartSeries(updatedOptions.series);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (chartSeries.length && !resizeRef.current) {
      resizeRef.current = true;
      window.dispatchEvent(new Event("resize"));
    }
  }, [chartSeries]);

  const additionalStages = 3;
  const teamCards = TeamData;

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleStage = (cardDetails) => {
    return Array.from(
      { length: cardDetails.noOfPRs + additionalStages },
      (_, seriesIndex) => {
        console.log({ _, seriesIndex });

        switch (seriesIndex) {
          case cardDetails.noOfPRs + additionalStages - 1:
            return additionalStepNames.at(-1);
          case cardDetails.noOfPRs + additionalStages - 2:
            return additionalStepNames.at(-2);
          case cardDetails.noOfPRs + additionalStages - 3:
            return additionalStepNames.at(-3);
          default:
            return `PR - ${seriesIndex + 1}`;
        }
      }
    )[cardDetails.currentStep - 1];
  };

  const fillColorGreen = "green";
  const fillColorRed = "red";

  return (
    <div className="flex flex-col w-full" style={{ height: "85vh" }}>
      <header className="flex justify-between py-4 items-center">
        <div>
          <span className="font-bold text-lg">Sprint Name</span>&nbsp;-&nbsp;
          <span>Sprint - {currentSprint}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-bold text-lg">Start date</span> - 10/05/2025
          </div>
          <div>
            <span className="font-bold text-lg">End date </span>- 20/05/2025
          </div>
        </div>
      </header>
      {/* <div className="text-right flex justify-end">
        <NavLink
          to="/manage-team"
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
        >
          <CogIcon className="w-6 h-6" />
          <span>Manage Team</span>
        </NavLink>
      </div> */}
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-1/2">
          {teamCards.map(
            (card, index) =>
              index % 3 === 0 && (
                <div className="flex flex-row" key={index}>
                  {teamCards.slice(index, index + 3).map((card) => (
                    <div
                      className={`card cursor-pointer shadow-md hover:shadow-lg transition duration-300 ease-in-out border border-gray-200 rounded-lg p-2 m-2 mx-6 w-1/3 ${
                        selectedCard?.teamName === card.teamName
                          ? "bg-blue-200 border-blue-800 shadow-xl hover:bg-blue-300"
                          : "bg-white hover:bg-gray-200"
                      }`}
                      key={card.teamName}
                      onClick={() => handleCardClick(card)}
                    >
                      <div className=" w-full text-left">
                        <div className="font-bold text-gray-600 text-xl uppercase">
                          {card.teamName}
                        </div>
                        <div className="justify-center font-bold text-gray-600 text-sm uppercase">
                          {handleStage(card)}
                        </div>
                        <div className="flex justify-end">
                          {card.currentStep > currentSprint && (
                            <UseAnimations
                              animation={arrowUp}
                              size={36}
                              strokeColor={fillColorGreen}
                              autoplay={false}
                            />
                          )}
                          {card.currentStep < currentSprint && (
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
        {selectedCard?.teamName && (
          <div className="w-1/2 h-full p-2" style={{ height: "80vh" }}>
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 h-full">
              <h2 className="text-xl font-bold">{selectedCard.teamName}</h2>
              <h3 className="text-lg">
                <span className="font-semibold text-xl">
                  {selectedCard.currentStep - 1}
                </span>
                &nbsp;out of&nbsp;
                <span className="font-semibold text-xl">
                  {selectedCard.noOfPRs + additionalStages}
                </span>
                &nbsp;steps completed
              </h3>
              <div className="mt-4">
                <Chart
                  key={selectedCard.teamName}
                  ref={chartRef}
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  height={450}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListView;
