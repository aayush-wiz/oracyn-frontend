import React, { useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeProvider";

// Creates a soft spotlight effect that follows the mouse cursor.
// This effect is only active in dark mode.
const ScrollSpotlight = () => {
  const { theme } = useTheme();
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") {
      const handleMouseMove = (e) => {
        if (spotlightRef.current) {
          spotlightRef.current.style.background = `radial-gradient(600px at ${e.pageX}px ${e.pageY}px, rgba(29, 78, 216, 0.15), transparent 100%)`;
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [theme]);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none relative inset-0 z-30 transition-all duration-300"
    ></div>
  );
};

export default ScrollSpotlight;
