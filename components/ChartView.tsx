"use client";

import React from "react";
import { Line, Bar, Pie, Doughnut, PolarArea, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// This is CRITICAL. You must register all the components you plan to use.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// A mapping to dynamically select the correct chart component.
const chartComponents = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut,
  polarArea: PolarArea,
  radar: Radar,
};

// Define a type for our chart data for better safety.
export interface ChartData {
  type: keyof typeof chartComponents;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Chart.js data object
  label: string;
}

export const ChartView = ({ chart }: { chart: ChartData }) => {
  const ChartComponent = chartComponents[chart.type] || Bar; // Default to Bar chart if type is invalid

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#FFFFFF", // White text for legend
        },
      },
      title: {
        display: true,
        text: chart.label, // Use the label from our data as the title
        color: "#FFFFFF", // White text for title
      },
    },
    scales: {
      x: {
        ticks: { color: "#CCCCCC" }, // Light grey for x-axis labels
        grid: { color: "rgba(255, 255, 255, 0.1)" }, // Dim grid lines
      },
      y: {
        ticks: { color: "#CCCCCC" }, // Light grey for y-axis labels
        grid: { color: "rgba(255, 255, 255, 0.1)" }, // Dim grid lines
      },
    },
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6 my-4">
      <ChartComponent data={chart.data} options={options} />
    </div>
  );
};
