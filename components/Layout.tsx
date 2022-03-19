import React from "react";
import { AuthButtons } from "./AuthButtons";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="h-screen bg-slate-800">
      <nav className="flex items-center justify-between px-10 py-4 font-bold ">
        <span className="text-gray-100">birdbath 🐥</span>
        <AuthButtons />
      </nav>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
