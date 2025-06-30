"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api"; // We only need this for the fetch call

// Import the UI and Chart rendering components
import { BackgroundGradient } from "./ui/background-gradient";
import { ChartView } from "./ChartView";

// --- START OF SELF-CONTAINED TYPE DEFINITIONS ---
// By defining the types here, we eliminate external dependencies and ensure correctness.

// This defines the basic data structure our ChartView component needs.
// This should mirror the type definition within your ChartView.tsx.
interface ChartDisplayData {
  type: "line" | "bar" | "pie" | "doughnut" | "polarArea" | "radar";
  data: any; // The actual chart.js data object
  label: string;
}

// This is the complete type for the objects we expect from our API call.
// It includes the chart data, the chart's own ID, and info about the chat it belongs to.
interface FullChartInfo extends ChartDisplayData {
  id: string;
  chat: {
    id: string;
    title: string;
  };
}

// --- END OF SELF-CONTAINED TYPE DEFINITIONS ---

// A skeleton loader to show while data is being fetched.
const AllChartsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-zinc-900 rounded-xl h-72 w-full"></div>
    ))}
  </div>
);

// A dedicated sub-component for rendering a single chart card.
// This keeps the code clean and the props clearly defined.
const ChartCard = ({ chart }: { chart: FullChartInfo }) => {
  return (
    <BackgroundGradient
      className="rounded-xl bg-zinc-900 overflow-hidden h-full"
      containerClassName="rounded-xl"
    >
      <div className="p-4 md:p-6 flex flex-col h-full">
        {/* Chart.js Visualization */}
        <div className="flex-grow">
          <ChartView chart={chart} />
        </div>
        {/* Chart Info */}
        <div className="mt-4 text-center border-t border-zinc-800 pt-4">
          <h3
            className="text-lg font-bold text-white truncate"
            title={chart.label}
          >
            {chart.label}
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            From Chat:{" "}
            <Link
              href={`/chats/${chart.chat.id}`}
              className="font-semibold text-blue-400 hover:underline"
            >
              <span title={chart.chat.title}>{chart.chat.title}</span>
            </Link>
          </p>
        </div>
      </div>
    </BackgroundGradient>
  );
};

// The main component that fetches and displays the gallery.
const AllCharts = () => {
  // `useQuery` is now explicitly told to expect an array of our self-contained type.
  const {
    data: charts,
    isLoading,
    isError,
    error,
  } = useQuery<FullChartInfo[]>({
    queryKey: ["allCharts"],
    queryFn: api.getAllCharts, // This still calls your API function
  });

  if (isLoading) {
    return <AllChartsSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 mt-8">
        <h2 className="text-xl font-bold">Failed to load charts</h2>
        <p className="text-zinc-500">{(error as Error).message}</p>
      </div>
    );
  }

  if (!charts || charts.length === 0) {
    return (
      <div className="text-center text-zinc-400 mt-8 border border-dashed border-zinc-700 rounded-lg py-12 px-6">
        <h2 className="text-xl font-bold">No Charts Found</h2>
        <p>
          You haven't generated any charts yet. Go to a chat and ask to
          visualize some data!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
      {charts.map((chart) => (
        <ChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  );
};

export default AllCharts;
