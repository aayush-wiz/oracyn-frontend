import React from "react";

// The ChartIcons object contains the SVG definitions for each chart type.
const ChartIcons = {
  Bar: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  ),
  Line: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 15l4-4 6 6 10-10"
      ></path>
    </svg>
  ),
  Pie: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 15.232A9 9 0 1115.232 3M9 12a9 9 0 009 9"
      ></path>
    </svg>
  ),
  Scatter: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
      ></path>
    </svg>
  ),
  Area: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4-4 6 6 10-10v10H4z"
      ></path>
    </svg>
  ),
};

// The ChartsSlider component displays a horizontal marquee of chart icons.
const ChartsSlider = () => {
  const charts = [
    { name: "Bar Chart", icon: <ChartIcons.Bar /> },
    { name: "Line Graph", icon: <ChartIcons.Line /> },
    { name: "Pie Chart", icon: <ChartIcons.Pie /> },
    { name: "Area Chart", icon: <ChartIcons.Area /> },
    { name: "Scatter Plot", icon: <ChartIcons.Scatter /> },
  ];

  // Duplicate the array to create a seamless looping effect
  const sliderItems = [...charts, ...charts, ...charts, ...charts];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">
          Generate Dynamic Charts
        </h2>
        <p className="text-lg text-slate-400 mt-2">
          Instantly visualize your data with a single prompt.
        </p>
      </div>
      <div className="relative flex whitespace-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        {/* First marquee instance */}
        <div className="flex slider-marquee">
          {sliderItems.map((item, index) => (
            <div
              key={`first-${index}`}
              className="mx-4 flex-shrink-0 w-48 h-48 flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-sky-500/20 text-sky-400"
            >
              <span className="text-6xl">{item.icon}</span>
              <span className="mt-2 text-white font-semibold">{item.name}</span>
            </div>
          ))}
        </div>
        {/* Second, identical marquee instance for the seamless loop effect */}
        <div aria-hidden="true" className="flex slider-marquee">
          {sliderItems.map((item, index) => (
            <div
              key={`second-${index}`}
              className="mx-4 flex-shrink-0 w-48 h-48 flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-sky-500/20 text-sky-400"
            >
              <span className="text-6xl">{item.icon}</span>
              <span className="mt-2 text-white font-semibold">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChartsSlider;
