import React from "react";
import { AuthButtons } from "./AuthButtons";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <nav className="flex items-center font-bold py-4 justify-between px-10">
        <span>birdbath</span>
        <AuthButtons />
      </nav>
      <div>{children}</div>
    </>
  );
};

export default Layout;
