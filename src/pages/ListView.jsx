import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
// import { CogIcon } from "../icons/CogIcon";
// import { NavLink } from "react-router";
import UseAnimations from "react-useanimations";
import arrowDown from "react-useanimations/lib/arrowDown";
import arrowUp from "react-useanimations/lib/arrowUp";
// import TeamData from "../data/TeamData";
import moment from "moment";

const additionalStepNames = ["PR-IP", "FR", "QG"];
const additionalStepDetails = [
  "Pre-Release IP",
  "Final Release",
  "Quality Gate",
];
function ListView() {
  const resizeRef = useRef(false);
  const chartRef = useRef();
  const [sprintDetails, setSprintDetails] = useState({});
  // const [currentSprint, setCurrentSprint] = useState(2);
  const [selectedCard, setSelectedCard] = useState(null);
  const [teamCards, setTeamCards] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    dataLabels: {
      enabled: false,
    },
    series: [],
    labels: [],
    legend: {
      show: false,
      customLegendItems: [],
      showForSingleSeries: true,
    },
    colors: ["#008000", "#FFA500", "#808080"],
  });
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/getSprintDetails`)
      .then((response) => response.json())
      .then((data) => {
        setSprintDetails(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/team`)
      .then((response) => response.json())
      .then((data) => {
        setTeamCards(data);
      })
      .catch((err) => console.error(err));
  }, []);

  console.log({ sprintDetails });

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
  // const teamCards = TeamData;

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
            return additionalStepDetails.at(-1);
          case cardDetails.noOfPRs + additionalStages - 2:
            return additionalStepDetails.at(-2);
          case cardDetails.noOfPRs + additionalStages - 3:
            return additionalStepDetails.at(-3);
          default:
            return `Pre-Release - ${seriesIndex + 1}`;
        }
      }
    )[cardDetails.currentStep - 1];
  };

  const fillColorGreen = "green";
  const fillColorRed = "red";

  return (
    <div className="flex flex-col w-full" style={{ height: "85vh" }}>
      <header className="flex items-center justify-between py-4">
        <div>
          <span className="text-lg font-bold">Sprint Name</span>&nbsp;-&nbsp;
          <span>{sprintDetails.sprintName}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="text-lg font-bold">Start date : </span>
            {sprintDetails.startDate
              ? moment(sprintDetails.startDate).format("MMMM Do YYYY")
              : "-"}
          </div>
          <div>
            <span className="text-lg font-bold">End date : </span>
            {sprintDetails.endDate
              ? moment(sprintDetails.endDate).format("MMMM Do YYYY")
              : "-"}
          </div>
        </div>
      </header>
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
        <div
          className={`flex flex-col ${selectedCard ? "w-1/2" : "w-full"} mx-4`}
        >
          {teamCards.map(
            (card, index) =>
              index % 3 === 0 && (
                <div
                  className="grid grid-cols-3 gap-4"
                  key={index}
                  style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr)" }}
                >
                  {teamCards.slice(index, index + 3).map((card) => (
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
        {selectedCard?.teamName && (
          <div className="w-1/2 h-full p-2" style={{ height: "80vh" }}>
            <div className="h-full p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold">{selectedCard.teamName}</h2>
              <h3 className="text-lg">
                <span className="text-xl font-semibold">
                  {selectedCard.currentStep - 1}
                </span>
                &nbsp;out of&nbsp;
                <span className="text-xl font-semibold">
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
                  height={400}
                />
                <div className="flex flex-row justify-center mt-4 space-x-4">
                  <div className="flex flex-row items-center">
                    <div className="w-4 h-4 bg-green-700 rounded-full"></div>
                    <span className="ml-2">Completed</span>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="ml-2">In Progress</span>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="ml-2">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListView;
