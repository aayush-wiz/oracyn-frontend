// Typing Effect Hook
import { useState, useEffect } from "react";

export const useTypingEffect = (text, speed = 100, shouldType = false) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!shouldType || hasStarted) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (!text) return;

    setDisplayedText("");
    setIsComplete(false);
    setHasStarted(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, shouldType, hasStarted]);

  return { displayedText, isComplete };
};
