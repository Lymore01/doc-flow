import { Skeleton } from "./ui/skeleton";

export default function ExcelSkeleton(){
    return (
        <div className="flex flex-col gap-4 p-4 w-full max-w-3xl mx-auto">
   
        <div className="flex gap-2">
          <Skeleton className="w-1/4 h-6  dark:bg-secondary bg-secondary" />
          <Skeleton className="w-1/4 h-6  dark:bg-secondary bg-secondary" />
          <Skeleton className="w-1/4 h-6  dark:bg-secondary bg-secondary" />
          <Skeleton className="w-1/4 h-6  dark:bg-secondary bg-secondary" />
        </div>
  
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-2">
            <Skeleton className="w-1/4 h-5  dark:bg-secondary bg-secondary" />
            <Skeleton className="w-1/4 h-5  dark:bg-secondary bg-secondary" />
            <Skeleton className="w-1/4 h-5  dark:bg-secondary bg-secondary" />
            <Skeleton className="w-1/4 h-5  dark:bg-secondary bg-secondary" />
          </div>
        ))}
      </div>
    )
}