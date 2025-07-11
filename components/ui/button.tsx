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
      px-6 py-2 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
