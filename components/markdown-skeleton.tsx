import { Skeleton } from "./ui/skeleton";

export default function MarkdownSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="w-1/2 h-6 rounded mb-4" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-4 rounded mb-2 dark:bg-secondary bg-secondary" />
      ))}
    </div>
  );
}
