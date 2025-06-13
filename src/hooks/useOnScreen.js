import { useState, useEffect, useRef } from "react";

// This custom hook detects if an element is visible in the viewport,
// which is used to trigger scroll-based animations.
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optional: stop observing once it's visible if triggerOnce is true
        if (options?.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

export default useOnScreen;
