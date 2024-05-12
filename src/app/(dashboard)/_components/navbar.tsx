import React from "react";
import MobileSidebar from "./mobile-sidebar";
import NavbarRoutes from "@/components/navbar-routes";

const Navbar = () => {
  return (
    <div className="flex h-full items-center border-b bg-background p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
