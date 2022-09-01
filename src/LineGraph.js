import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data[casesType]) {
    if (lastDataPoint) {
      chartData.push(data[casesType][date] - lastDataPoint);
    } else {
      chartData.push(data[casesType][date]);
    }

    lastDataPoint = data[casesType][date];
  }

  return chartData;
};

const month = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const buildLabel = (data, casesType = "cases") => {
  const label = [];
  for (let date in data[casesType]) {
    let Month = new Date(date).getMonth();
    let Year = new Date(date).getFullYear();
    let formattedDate = `${month[Month]} ${Year}`;
    label.push(formattedDate);
  }

  return label;
};

const LineGraph = ({ casesType }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const [data, setData] = useState([]);
  const [label, setLabel] = useState([]);

  const lineData = {
    labels: label,
    datasets: [
      {
        label: `Worldwide new ${casesType}`,
        data: data,
        borderColor: "#CC1034",
        backgroundColor: "rgba(204, 16, 52, 0.5)",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let chartData = buildChartData(data, casesType);
          let chartLabel = buildLabel(data, casesType);
          setData(chartData);
          setLabel(chartLabel);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          height={"300px"}
          width={"200px"}
          options={options}
          data={lineData}
        />
      )}
    </div>
  );
};

export default LineGraph;
