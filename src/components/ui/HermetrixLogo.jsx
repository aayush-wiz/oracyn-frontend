import React from "react";

export const HermetrixLogo = () => (
  <div className="relative w-8 h-8 group cursor-pointer">
    <svg
      className="absolute w-full h-full text-white transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-90"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M21.64,5.64l-2-1.5C19.26,3.86,18.6,4.17,18.3,4.5l-3.15,6.3a.5.5,0,0,1-.89-.44L15.1,3.44A2.5,2.5,0,0,0,12.6,1h-1a2.5,2.5,0,0,0-2.5,2.5V8.8a.5.5,0,0,1-.89.44L5.07,2.92A2.5,2.5,0,0,0,2.5,1h-1A1.5,1.5,0,0,0,0,2.5v1A1.5,1.5,0,0,0,1.5,5H2a.5.5,0,0,1,.45.69L4.3,12.5a2.5,2.5,0,0,0,4.44,1.88l2.5-5a.5.5,0,0,1,.89.44l-.84,6.74A2.5,2.5,0,0,0,13.78,24h.72a2.5,2.5,0,0,0,2.49-2.22l1.62-13a.5.5,0,0,1,.89.44L18.66,16.5a2.5,2.5,0,0,0,4.84.22l.5-1A1.5,1.5,0,0,0,24,14.5v-1a1.5,1.5,0,0,0-1.5-1.5H22a.5.5,0,0,1-.45-.69l1.84-3.67C23.67,7.26,24,6.6,24,6a1.5,1.5,0,0,0-1.5-1.5h-1A.5.5,0,0,1,21.64,5.64Z" />
    </svg>
    <svg
      className="absolute w-full h-full text-white opacity-0 scale-90 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M4 18h3v-6H4v6zm4-2h3V8H8v8zm4-4h3v-2h-3v2zm4 0h3v-4h-3v4zM2 20h20V4H2v16z" />
    </svg>
  </div>
);

export default HermetrixLogo;
