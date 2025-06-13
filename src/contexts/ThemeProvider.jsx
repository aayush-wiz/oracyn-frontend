import React, { useState, useEffect, createContext, useContext } from "react";

export const ThemeContext = createContext();

// This provider manages the light/dark theme state for the whole app.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Apply the theme class to the root <html> element
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily access the theme context.
export const useTheme = () => useContext(ThemeContext);
