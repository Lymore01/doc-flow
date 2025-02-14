"use client";

import { Edit, EllipsisVertical, Info, Search, Trash } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { Input } from "../../../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CLUSTERS } from "../../../../lib/constants";
import { cn } from "../../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../../../../components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import AddClusterForm from "../../../../components/add-cluster-form";
import Link from "next/link";
import { Skeleton } from "../../../../components/ui/skeleton";
import { useEffect, useState } from "react";

//TODO: validate cluster name
const clusterFormSchema = z.object({
  clusterName: z
    .string()
    .min(6, { message: "Cluster name should be at least 6 characters long" })
    .max(15, "Cluster name should be less than 15 characters"),
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof clusterFormSchema>>({
    resolver: zodResolver(clusterFormSchema),
    defaultValues: {
      clusterName: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  function onSubmit(values: z.infer<typeof clusterFormSchema>) {
    //TODO: api call
    console.log(values);
  }
  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <div className="text-lg py-4 px-6 flex justify-between items-center">
          <h1>Clusters</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Info />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="dark:bg-secondary dark:text-white">
                <p>
                  A grouped collection of documents with a shareable link for
                  easy access and distribution.
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
                className="w-full flex items-center justify-start"
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
            {loading
              ? Array.from({ length: CLUSTERS.length }).map((_, idx) => (
                  <div key={idx} className="space-y-4">
                    <ClusterSkeleton />
                  </div>
                ))
              : CLUSTERS.map((cluster) => (
                  <Link
                    href={`/dashboard/cluster/${cluster.id}`}
                    className="w-full py-2 rounded-lg hover:font-semibold cursor-pointer text-sm transition-all flex justify-between items-center"
                    key={cluster.id}
                  >
                    <p className="capitalize">{cluster.name}</p>
                    <div className="flex gap-2 items-center">
                      <Tag title={cluster.visibility} />
                      {/* actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right">
                          <DropdownMenuItem>
                            <span className="flex gap-2">
                              <Edit size={16} />
                              <span>Edit cluster</span>
                            </span>
                          </DropdownMenuItem>
                          <Separator className="my-2" />
                          <DropdownMenuItem className="group">
                            <span className="flex gap-2 w-full group-hover:text-[red]">
                              <Trash size={16} />
                              <span>Delete cluster</span>
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1">{children}</div>
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

const ClusterSkeleton = () => {
  return (
    <div className="flex justify-between gap-4 items-center">
      {/* name */}
      <Skeleton className="w-full h-4 rounded dark:bg-secondary bg-secondary" />
      <div className="flex gap-2 items-center">
        <Skeleton className="rounded-full h-6 w-10 dark:bg-secondary bg-secondary" />
        <Skeleton className="rounded h-4 w-2 dark:bg-secondary bg-secondary" />
      </div>
    </div>
  );
};
