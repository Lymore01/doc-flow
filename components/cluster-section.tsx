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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
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
import { Cluster } from "./types/types";
import { Skeleton } from "./ui/skeleton";
import { AxiosError } from "axios";
import { toast } from "../hooks/use-toast";

export default function ClusterSection({
  form,
  onSubmit,
  loading,
}: {
  form: any;
  onSubmit: (values: any) => void;
  loading: boolean;
}) {
  const [clusterName, setClusterName] = useState<string>("");
  const [documentToDelete, setDocumentToDelete]  = useState(null);

  const { user } = useUser();

  const { isPending: isPendingDelete, mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`/api/clusters/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete cluster");
        }
        return response.json();
      } catch (error) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof AxiosError) {
          errorMessage = error?.response?.data?.error || errorMessage;
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      toast({
        title: "Cluster Deleted Successfully!",
        description: "Cluster has been deleted successfully.",
      });
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Cluster deletion Failed",
        description: errorMessage,
      });
    },
  });

  // delete cluster
  async function handleClusterDelete(id: string) {
    setDocumentToDelete(id)
    await mutateAsync(id);
  }

  // fetch from the server
  const {
    data: fetchedClusters,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["clusters", user?.id],
    refetchInterval: 3000,
    queryFn: async () => {
      if (user?.id) {
        //! fix: update the user id to be dynamic
        const response = await fetch(`/api/clusters?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
  });

  const filteredData = fetchedClusters?.clusters?.filter((cluster: Cluster) =>
    cluster.name.toLowerCase().includes(clusterName.toLowerCase())
  );

  if (error) return <p>Error loading clusters.</p>;

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
              <AddClusterForm
                form={form}
                onSubmit={onSubmit}
                loading={loading}
              />
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
          {isLoading && (
            <div className="w-full py-2 rounded-lg hover:font-semibold cursor-pointer text-sm transition-all flex justify-between items-center">
              <Skeleton className="w-40 h-8" />
              <div className="flex gap-2 items-center">
                {/* tag */}
                <Skeleton className="w-16 h-8 rounded-full" />
                <Skeleton className="w-2 h-8" />
              </div>
            </div>
          )}
          {filteredData?.length === 0 ? (
            <div className="p-4 flex items-center justify-center">
              <span className="text-sm">
                Oops, Clusters Not Found, Please Create One!
              </span>
            </div>
          ) : (
            filteredData?.map((cluster: Cluster) => (
              <div
                className="w-full py-2 rounded-lg hover:font-semibold cursor-pointer text-sm transition-all flex justify-between items-center"
                key={cluster.id}
              >
                <Link
                  href={`/dashboard/cluster/${cluster.id}`}
                  className={cn(
                    "capitalize transition-opacity",
                    isPendingDelete && documentToDelete === cluster.id ? "opacity-40 text-red-600" : ""
                  )}
                >
                  {cluster.name}
                </Link>
                <div className="flex gap-2 items-center">
                  <Tag title={"Public"} />
                  {/* actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                      {/* edit cluster name */}
                      <EditCluster
                        clusterName={cluster.name}
                        cluster_id={cluster.id}
                      />

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="group"
                        onClick={() => {
                          handleClusterDelete(cluster.id);
                        }}
                      >
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
