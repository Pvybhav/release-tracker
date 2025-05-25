import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

function ChartView({ selectedCard, additionalStages, additionalStepNames }) {
  const resizeRef = useRef(false);
  const chartRef = useRef();

  const [chartOptions, setChartOptions] = useState({
    dataLabels: {
      enabled: false,
    },
    series: [],
    labels: [],
    legend: {
      show: false,
    },
    colors: ["#008000", "#FFA500", "#808080"],
  });

  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (chartSeries.length && !resizeRef.current) {
      resizeRef.current = true;
      window.dispatchEvent(new Event("resize"));
    }
  }, [chartSeries]);

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
          show: false,
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

  return (
    <div className="h-full p-2" style={{ height: "80vh" }}>
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
  );
}

export default ChartView;
