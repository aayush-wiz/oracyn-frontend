import React from "react";
import AllCharts from "@/components/AllCharts"; // Import the new component

const AllChartsPage = () => {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Chart Gallery
        </h1>
        <p className="text-zinc-400">
          Here are all the visualizations you have generated across all your
          chats.
        </p>
      </div>

      {/* The component that fetches and renders the chart grid */}
      <AllCharts />
    </div>
  );
};

export default AllChartsPage;
