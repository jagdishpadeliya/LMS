"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);
  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      className={cn(
        "flex flex-row items-center gap-x-2  pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        isActive &&
          "bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
      {/* fix h-full */}
      <div
        className={cn(
          "ml-auto h-12 border-2 border-sky-700 opacity-0 transition-all",
          isActive && "opacity-100",
        )}
      />
    </button>
  );
};

export default SidebarItem;
