import React from "react";
import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-background shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
