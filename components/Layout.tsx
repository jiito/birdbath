import React from "react";
import { AuthButtons } from "./AuthButtons";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <nav className="flex items-center justify-between px-4 py-4 font-bold ">
        <span className="text-gray-100">birdbath 🐥</span>
        <AuthButtons />
      </nav>
      <div>{children}</div>
    </>
  );
};

export default Layout;
