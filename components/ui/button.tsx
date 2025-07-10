import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`
      px-4 py-2 rounded-md 
      bg-slate-800 text-slate-200 font-medium 
      border border-slate-600
      hover:bg-slate-700 hover:text-white
      active:bg-slate-600 active:text-white
      focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
      transition-all duration-200 ease-in-out
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
