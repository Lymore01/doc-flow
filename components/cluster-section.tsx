/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, EllipsisVertical, Info, Search, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddClusterForm from "./add-cluster-form";
import { Input } from "./ui/input";
import { useState } from "react";
import { CLUSTERS } from "../lib/constants";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import EditCluster from "./edit-cluster";
import { cn } from "../lib/utils";

export default function ClusterSection({
  form,
  onSubmit,
}: {
  form: any;
  onSubmit: (values: any) => void;
}) {
  const [clusterName, setClusterName] = useState<string>("");
  const filteredData = CLUSTERS.filter((cluster) =>
    cluster.name.toLowerCase().includes(clusterName.toLowerCase())
  );

  return (
    <div className="w-full md:w-1/4 max-h-screen">
      <div className="text-lg py-4 px-6 flex justify-between items-center">
        <h1 className="text-sm md:text-base">Clusters</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark:bg-secondary dark:text-white">
              <p>
                A grouped collection of documents with a shareable link for easy
                access and distribution.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      <div className="py-4 px-6 space-y-2">
        {/* add new cluster */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"secondary"}
              className="w-full flex items-center justify-start bg-blue-600 text-white"
            >
              <Edit />
              <span>New Cluster</span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create A Cluster</DialogTitle>
              <DialogDescription>
                Clusters are grouped collection of documents with a shareable
                link for easy access and distribution.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div>
              <AddClusterForm form={form} onSubmit={onSubmit} />
            </div>
          </DialogContent>
        </Dialog>
        {/* search */}
        <div className="flex justify-between items-center border rounded-lg focus-visible:ring-1 focus-visible:ring-ring">
          <Input
            placeholder="Search clusters..."
            className="placeholder:text-sm border-none outline-none focus-visible:ring-0"
            value={clusterName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setClusterName(event.target.value);
            }}
          />
          <div className="p-2">
            <Search size={16} />
          </div>
        </div>
      </div>
      <Separator />

      {/* list clusters */}
      <div className="py-4 px-6 space-y-4">
        <h1>My Clusters</h1>
        {/* clusters */}
        <div className="space-y-2 ">
          {filteredData.length === 0 ? (
            <div className="p-4 flex items-center justify-center">
              <span className="text-sm">Oops, Cluster Not Found!</span>
            </div>
          ) : (
            filteredData.map((cluster) => (
              <div
                className="w-full py-2 rounded-lg hover:font-semibold cursor-pointer text-sm transition-all flex justify-between items-center"
                key={cluster.id}
              >
                <Link
                  href={`/dashboard/cluster/${cluster.id}`}
                  className="capitalize"
                >
                  {cluster.name}
                </Link>
                <div className="flex gap-2 items-center">
                  <Tag title={cluster.visibility} />
                  {/* actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                      {/* edit cluster name */}
                      <EditCluster clusterName={cluster.name} />

                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="group">
                        <span className="flex gap-2 w-full group-hover:text-[red]">
                          <Trash size={16} />
                          <span>Delete cluster</span>
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
const Tag = ({ title }: { title: string }) => {
  return (
    <div
      className={cn(
        "text-xs rounded-full py-2 px-4 border border-border bg-primary-foreground",
        title === "private" && "bg-transparent"
      )}
    >
      <span>{title}</span>
    </div>
  );
};
// const ClusterSkeleton = () => {
//   return (
//     <div className="flex justify-between gap-4 items-center">
//       {/* name */}
//       <Skeleton className="w-full h-4 rounded dark:bg-secondary bg-secondary" />
//       <div className="flex gap-2 items-center">
//         <Skeleton className="rounded-full h-6 w-10 dark:bg-secondary bg-secondary" />
//         <Skeleton className="rounded h-4 w-2 dark:bg-secondary bg-secondary" />
//       </div>
//     </div>
//   );
// };
