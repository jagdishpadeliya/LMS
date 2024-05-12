import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import Navbar from "../app/(dashboard)/_components/navbar";

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <Navbar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
