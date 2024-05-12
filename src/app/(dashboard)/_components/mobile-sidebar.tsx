import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import Sidebar from "./sidebar";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition-all hover:opacity-75 active:scale-90 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-background p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
