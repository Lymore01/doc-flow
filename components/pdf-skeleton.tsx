import { Skeleton } from "./ui/skeleton";

export default function PdfSkeleton(){
    return (
      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
        <Skeleton className="w-3/4 h-6 rounded dark:bg-secondary bg-secondary" />
        <Skeleton className="w-full h-4 rounded dark:bg-secondary bg-secondary" />
        <Skeleton className="w-5/6 h-4 rounded dark:bg-secondary bg-secondary" />
        <Skeleton className="w-2/3 h-4 rounded dark:bg-secondary bg-secondary" />
        <Skeleton className="w-full h-64 rounded-lg dark:bg-secondary bg-secondary" />
        <Skeleton className="w-1/3 h-4 rounded mx-auto dark:bg-secondary bg-secondary" />
      </div>
    );
  };