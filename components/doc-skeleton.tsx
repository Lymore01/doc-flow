import { Skeleton } from "./ui/skeleton";

export default function DocSkeleton(){
    return (
        <div className="flex flex-col gap-4 p-4 w-full max-w-2xl mx-auto">
 
        <Skeleton className="w-3/4 h-6 rounded dark:bg-secondary bg-secondary" />

        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-4 rounded dark:bg-secondary bg-secondary" />
        ))}

        <Skeleton className="w-full h-40 rounded-lg dark:bg-secondary bg-secondary" />

        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-5/6 h-4 rounded dark:bg-secondary bg-secondary" />
        ))}
      </div>
    )
}