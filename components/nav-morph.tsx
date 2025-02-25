/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";

export default function NavMorph({
  navH,
  items,
  setActiveItem,
  label,
}: {
  navH?: number;
  items: any[];
  setActiveItem: (arg: any) => void;
  label: string;
}) {
  return items.length === 0 ? (
    <></>
  ) : (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "md:absolute bg-background dark:bg-card-dark md:dark:bg-card-dark shadow-xl rounded-lg p-0 md:p-4 w-full md:w-96 grid gap-3"
      )}
      style={{ top: `${navH}px` }}
      onMouseEnter={() => setActiveItem(label)}
      onMouseLeave={() => setActiveItem(null)}
      key={label}
    >
      {items.map((item) => (
        <>
          <Card
            key={item.name}
            className="dark:bg-card-dark border border-gray-200 dark:border-gray-700 shadow-md rounded-none hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
          >
            <CardContent className="grid gap-3 p-4 relative">
              <div className="flex items-center gap-3">
                {item.icon}
                <h3 className="text-lg font-semibold text-card-foreground dark:text-card-foreground">
                  {item.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
              <div className="absolute inset-0 right-4 top-4 flex items-start justify-end">
                <span className="text-sm text-card-foreground hidden items-center gap-1 group-hover:flex transition-transform hover:text-primary dark:hover:text-primary">
                  view <ArrowRight size={16} />
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      ))}
    </motion.div>
  );
}
