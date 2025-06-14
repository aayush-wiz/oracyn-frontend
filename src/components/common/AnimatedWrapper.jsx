// Enhanced AnimatedWrapper with more customization options
import React, { useEffect, useRef, useState } from "react";

const AnimatedWrapper = ({
  children,
  customClass = "",
  animation = "slideUp", // slideUp, slideDown, slideLeft, slideRight, fade, scale
  duration = 1000, // Animation duration in ms
  delay = 0, // Animation delay in ms
  threshold = 0.1, // How much of element must be visible to trigger
  triggerOnce = true, // Whether animation should only happen once
  disabled = false, // Disable animation entirely
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation variants
  const animations = {
    slideUp: {
      hidden: "opacity-0 translate-y-10",
      visible: "opacity-100 translate-y-0",
    },
    slideDown: {
      hidden: "opacity-0 -translate-y-10",
      visible: "opacity-100 translate-y-0",
    },
    slideLeft: {
      hidden: "opacity-0 translate-x-10",
      visible: "opacity-100 translate-x-0",
    },
    slideRight: {
      hidden: "opacity-0 -translate-x-10",
      visible: "opacity-100 translate-x-0",
    },
    fade: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    scale: {
      hidden: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
  };

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, triggerOnce, disabled]);

  const currentAnimation = animations[animation] || animations.slideUp;

  return (
    <div
      ref={ref}
      className={`${customClass} transition-all ease-out ${
        isVisible ? currentAnimation.visible : currentAnimation.hidden
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedWrapper;
