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
      px-4 py-2 rounded 
      bg-black text-slate-400 font-semibold 
      transition-colors duration-200
      hover:bg-slate-400 hover:text-black
      active:bg-slate-600 active:text-white
      focus:outline-none focus:ring-2 focus:ring-slate-400
      w-full
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
