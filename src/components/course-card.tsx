import Image from "next/image";
import Link from "next/link";
import React from "react";
import IconBadge from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

type CourseCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  chapterLength: number;
  price: number;
  progress: number | null;
  category: string;
};

const CourseCard = ({
  id,
  title,
  imageUrl,
  chapterLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/course/${id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {chapterLength} {chapterLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>TODO:Progress Component</div>
          ) : (
            <span className="text-md font-medium text-slate-700 md:text-sm">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
