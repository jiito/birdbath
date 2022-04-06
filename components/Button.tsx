import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  styleType = "primary",
  children,
  ...rest
}) => {
  const className = `${getButtonStyle(styleType)} py-1.5 px-3 rounded`;
  console.log(className);
  return (
    <>
      <button className={className} {...rest}>
        {children}
      </button>
    </>
  );
};

const getButtonStyle = (type: ButtonProps["styleType"]) => {
  switch (type) {
    case "primary":
      return "text-white bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600";
    case "secondary":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-200 text-gray-600";
  }
};
