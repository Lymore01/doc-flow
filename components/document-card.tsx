/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Download,
  Eye,
  FileText,
  FolderEdit,
  Loader2,
  MoveRight,
  Trash,
} from "lucide-react";
import { getFileIcon } from "../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import DocumentViewer from "./document-viewer";
import { useState } from "react";
import { Switch } from "./ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CLUSTERS } from "../lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Separator } from "./ui/separator";
import Selection from "./selection";
import { moveDocumentToCluster } from "../app/(user)/dashboard/actions";
import { toast } from "../hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { downloadDocument } from "../supabase/storage/client";

interface DocumentCardProps {
  id: string;
  name: string;
  type: string | undefined;
  size: string;
  date: string;
  url: string;
  cluster: string;
  clusterId: string;
  clusters: {
    clusterId: string;
    clusterName: string;
  }[];
}

export default function DocumentCard({
  id,
  name,
  type,
  size,
  date,
  cluster,
  clusterId,
  clusters,
  url,
}: DocumentCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<{
    name: string;
    id: string;
  } | null>({
    name: "",
    id: "",
  });

  const queryClient = useQueryClient();

  const handleMoveToCluster = async (
    documentId: string,
    newClusterId: string
  ) => {
    try {
      setIsLoading(true);
      const { message, success } = await moveDocumentToCluster(
        documentId,
        newClusterId
      );
      if (success) {
        setIsLoading(false);
        toast({
          title: "Success",
          description: message + " " + "to" + " " + selectedCluster?.name,
          variant: "default",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error", (error as Error).message);
      toast({
        title: "Error",
        description: "Error moving document",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["viewDocuments"] });
    }
  };

  const { isPending: isPendingDelete, mutateAsync } = useMutation({
    mutationFn: async (data: { id: string; clusterId: string }) => {
      try {
        const response = await fetch(
          `/api/documents/${data.id}?clusterId=${clusterId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete document");
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
        title: "Document Deleted Successfully!",
        description: "Document has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["viewDocuments"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Document deletion Failed",
        description: errorMessage,
      });
    },
  });

  const handleFileDownload = async (url: string) => {
    // make a get request to retrieve the file
    try {
      setIsDownloading(true);
      await downloadDocument({
        fileUrl: url,
      });
      toast({
        title: "Document downloaded successfully!",
        description: "Document has been downloaded successfully.",
      });
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      toast({
        variant: "destructive",
        title: "Error downloading document!",
        description: (error as Error).message,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileDelete = async ({
    id,
    clusterId,
  }: {
    id: string;
    clusterId: string;
  }) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this file? This action cannot be undone."
    );
    if (userConfirmed) {
      await mutateAsync({
        id,
        clusterId,
      });
    }
  };
  return (
    <Card className="rounded-md shadow-md">
      <CardHeader className="flex items-center justify-between p-4 border-b bg-secondary">
        <div className="max-w-[200px] md:w-full">
          <CardTitle className="text-sm font-semibold truncate">
            {name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4 grid gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={`/images/${getFileIcon({ name: `example.${type}` })}`}
            alt={`${type} Icon`}
            width={50}
            height={50}
            className="w-12 h-12 object-contain"
          />
          <div>
            <p className="text-xs ">Type: {type?.toUpperCase()}</p>
            <p className="text-xs ">Size: {size}</p>
            <p className="text-xs ">
              Uploaded:{" "}
              {new Date(date).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p className="text-xs ">Cluster: {cluster}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex justify-end gap-2">
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-4 h-screen overflow-auto overflow-y-scroll"
          >
            <div className="p-4 h-screen overflow-auto flex flex-col gap-4">
              <Card className="shadow-md border border-gray-200">
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-gray-600" />
                    <h2 className="text-lg font-semibold">project report</h2>
                  </div>
                  <p className="text-sm text-gray-500">Feb 30, 2025</p>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Type: pdf</p>
                    <p>Size: 10mb</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Download className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <FolderEdit className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <span className="px-2 text-sm font-semibold">
                          Clusters
                        </span>
                        <DropdownMenuSeparator />
                        {CLUSTERS.map((cluster) => (
                          <DropdownMenuItem
                            key={cluster.id}
                            onClick={(cluster) => handleMoveToCluster(cluster.name)}
                          >
                            {cluster.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleFileDelete}
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <Switch
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
                <span className="text-sm text-gray-600">Toggle Preview</span>
              </div>

              {showPreview && (
                <div className="border rounded-lg shadow-md p-4 overflow-auto h-[70vh]">
                  <DocumentViewer
                    fileType="docx"
                    fileUrl="/documents/sample.docx"
                  />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="default"
              // onClick={(cluster) => handleMoveToCluster(cluster.name)}
            >
              <FolderEdit className="w-4 h-4 " />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-base">Move Documents</DialogTitle>
              <DialogDescription className="text-sm">
                Select a cluster where this document belongs to keep everything
                neat and tidy.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="mt-4 grid grid-cols-2 items-center justify-center">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  From:
                </label>
                <div className="max-w-[160px] mt-2 ">
                  <span className="truncate">{cluster}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To:</label>
                <div className="mt-2">
                  <Selection
                    items={[
                      ...new Set(
                        clusters
                          .filter((link) => link.clusterName !== cluster)
                          .map((link) => link.clusterName)
                      ),
                    ]}
                    onValueChange={(value: string) => {
                      setSelectedCluster({
                        name: value,
                        id:
                          clusters.find(
                            (cluster) => cluster.clusterName === value
                          )?.clusterId || "",
                      });
                    }}
                    label={"Cluster"}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-blue-600 text-white"
                onClick={() =>
                  selectedCluster?.id &&
                  handleMoveToCluster(id, selectedCluster.id)
                }
                disabled={!selectedCluster?.id}
              >
                {isLoading ? (
                  <div className="flex gap-2 items-center">
                    <Loader2 className="animate-spin" />
                    <span>Moving</span>
                  </div>
                ) : (
                  "Move"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          size="sm"
          variant="default"
          onClick={() => handleFileDownload(url)}
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Download className="w-4 h-4 " />
          )}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleFileDelete({ id, clusterId })}
        >
          {isPendingDelete ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash className="w-4 h-4 " />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Todo: ensure the document card actions and search filter (from the server) are working
