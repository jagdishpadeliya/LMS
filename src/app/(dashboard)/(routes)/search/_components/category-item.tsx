import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import qs from "query-string";
type CategoryItemProps = {
  label: string;
  icon: IconType;
  value: string;
};

const CategoryItem = ({ label, icon: Icon, value }: CategoryItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const isSelected = currentCategoryId === value;
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );
    router.push(url);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        `mb-2 flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm
  `,
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800",
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
