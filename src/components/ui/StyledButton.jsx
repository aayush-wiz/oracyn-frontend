import React from "react";

export const StyledButton = ({
  onClick,
  children,
  className = "",
  variant = "primary",
}) => {
  const baseClasses =
    "group relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300";

  const variants = {
    primary: "shimmer-effect bg-white text-slate-900 shadow-md",
    secondary:
      "border-chase-effect bg-transparent text-slate-300 border border-slate-700 hover:bg-slate-800/50",
    cta: "shimmer-effect bg-white text-sky-600 shadow-lg",
    hero: "shimmer-effect bg-slate-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {variant === "hero" && (
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-sky-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
      )}
      {variant === "hero" && (
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black/20"></span>
      )}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
};

export default StyledButton;
