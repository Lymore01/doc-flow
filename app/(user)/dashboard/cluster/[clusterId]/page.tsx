"use client";

import { useParams, useRouter } from "next/navigation";
import { Separator } from "../../../../../components/ui/separator";
import { Button } from "../../../../../components/ui/button";
import {
  Check,
  ChevronDown,
  Clipboard,
  CopyIcon,
  EllipsisVertical,
  RefreshCcw,
  Search,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "../../../../../components/ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import MoveDocuments from "../../../../../components/move-documents";
import { useToast } from "../../../../../hooks/use-toast";
import { Input } from "../../../../../components/ui/input";
import UploadDocument from "../../../../../components/upload-document";
import EditDocument from "../../../../../components/edit-document";
import EditCluster from "../../../../../components/edit-cluster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { Document } from "../../../../../components/types/types";
import { cn, getFileIcon } from "../../../../../lib/utils";
import { AxiosError } from "axios";
import { useUser } from "@clerk/nextjs";
import { DeleteDialog } from "../../../../../components/delete-dialog";

export default function ClusterPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const linkref = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const { clusterId } = useParams();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { user } = useUser();

  const [isRefLoading, setIsRefLoading] = useState(false);

  const { isPending: isPendingDelete, mutateAsync } = useMutation({
    mutationFn: async (data: { id: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ["documents"] });
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

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
    return;
  }, [isCopied]);

  // ! fix
  const { data: clusterData, isLoading: isClusterLoading } = useQuery({
    queryKey: ["clusterName", clusterId],
    queryFn: async () => {
      if (clusterId) {
        const response = await fetch(`/api/clusters/${clusterId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch clusters.");
        }
        return response.json();
      }
      throw new Error("Cluster ID is undefined.");
    },
    enabled: !!clusterId,
  });

  const {
    data: fetchedDocuments,
    error,
    isLoading,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["documents", user?.id],
    queryFn: async () => {
      if (user?.id) {
        const response = await fetch(`/api/documents?clusterId=${clusterId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch documents.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
    enabled: !!user?.id,
  });

  if (error) return <p>Error loading documents.</p>;

  const handleReloadClick = async () => {
    setIsRefLoading(true);
    try {
      await refetchDocuments();
    } finally {
      setIsRefLoading(false);
    }
  };

  const filteredDocs = fetchedDocuments?.documents?.filter((doc: Document) =>
    doc.document.name.toLowerCase().includes(documentName.toLowerCase())
  );

  async function handleCopyToClipboard() {
    try {
      await navigator.clipboard.writeText(
        linkref.current ? linkref.current.innerHTML : ""
      ); //! fix: only works on **https**
      setIsCopied(true);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to copy url: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  }

  async function handleDocumentDelete(id: string) {
    try {
      if (!id) {
        toast({
          title: "Invalid file id",
          description: "Please provide a valid file id to delete.",
          variant: "destructive",
        });
        return;
      }

      setDocumentToDelete(id);
      await mutateAsync({
        id,
      });
    } catch (err) {
      toast({
        title: "Unexpected Error",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  }

  // TODO: fetch from db
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="text-lg py-4 px-6 flex flex-wrap lg:flex-row justify-between items-center gap-3">
        {/* dont display on large devices */}
        <div className="flex md:hidden items-center justify-between w-full lg:w-auto">
          <span className="text-xl font-semibold truncate w-[200px]">
            {isClusterLoading && <Skeleton className="w-40 h-8" />}
            {clusterData?.cluster.name}
          </span>
          <EditCluster
            clusterName={clusterData?.cluster.name}
            isDropDown={false}
          />
        </div>
        <div className="flex flex-wrap lg:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center border rounded-lg w-full lg:w-auto">
            <Input
              placeholder="Search documents..."
              className="placeholder:text-sm border-none outline-none focus-visible:ring-0 flex-1"
              value={documentName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDocumentName(event.target.value);
              }}
            />
            <div className="p-2">
              <Search size={16} />
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />

          <Button
            variant="secondary"
            className={`w-full lg:w-auto flex items-center gap-2 ${
              isRefLoading
                ? "hover:bg-blue-600 hover:text-white"
                : "hover:bg-secondary"
            }`}
            onClick={handleReloadClick}
          >
            <RefreshCcw
              size={16}
              className={`transition-transform ${
                isRefLoading ? "animate-spin" : ""
              }`}
            />
            <span>Reload</span>
          </Button>

          <UploadDocument clusterId={clusterId as string} />

          <Separator orientation="vertical" className="hidden lg:block" />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="w-full lg:w-auto flex items-center gap-2 bg-blue-600 text-white"
              >
                <Clipboard size={16} />
                <span>Get URL</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get Url</DialogTitle>
                <DialogDescription>
                  This Url contains all the documents in cluster &quot;
                  {`${clusterData?.cluster.name}`}&quot;
                </DialogDescription>
              </DialogHeader>

              <Separator />

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="edit" className="border-none">
                  <AccordionTrigger className="flex justify-between items-center w-full">
                    <span>Edit</span>
                    <ChevronDown size={16} />
                  </AccordionTrigger>
                  <AccordionContent>
                    <MoveDocuments />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator />

              <DialogFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-2 items-center">

                  <p className="text-sm w-[150px] md:w-[200px] truncate" ref={linkref}>
                    {`https://405f-41-89-16-2.ngrok-free.app/url/${clusterData?.cluster.link.trackingId}`}
                  </p>
                  <Button variant={"ghost"} onClick={()=>{
                    router.push(`https://405f-41-89-16-2.ngrok-free.app/url/${clusterData?.cluster.link.trackingId}`)
                    // sample: https:trackify.io/url/czzxc
                  }}>
                    View Profile
                  </Button>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleCopyToClipboard}
                    className="bg-blue-600 text-white"
                  >
                    {isCopied ? (
                      <>
                        <Check size={16} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon size={16} />
                        <span>Copy Url</span>
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      <div className="h-screen flex">
        {/* list */}
        <div className="w-full md:w-1/4">
          <div className="py-4 px-6 ">
            <h1 className="text-lg">Documents</h1>
          </div>

          <Separator />
          <div className="py-4 space-y-4">
            {isLoading && (
              <div className="w-full py-2 px-4 rounded-lg hover:font-semibold cursor-pointer text-sm transition-all flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-40 h-8" />
                </div>

                <Skeleton className="w-2 h-8" />
              </div>
            )}
            {fetchedDocuments?.documents?.length === 0 ? (
              <div className="p-4 flex items-center justify-center">
                <span className="text-sm text-center text-muted-foreground">
                  😅 Oops, nothing here! Start your adventure by uploading a
                  document! 📄
                </span>
              </div>
            ) : filteredDocs?.length === 0 ? (
              <div className="p-4 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  Document not found!
                </span>
              </div>
            ) : (
              filteredDocs?.map((doc: Document) => (
                <div key={doc.document.id}>
                  <div className="flex items-center justify-between gap-4 text-sm hover:font-semibold transition-all cursor-pointer px-4">
                    <div
                      onClick={() => {
                        router.push(
                          `/dashboard/cluster/${clusterId}/document/${doc.document.id}`
                        );
                      }}
                      className={cn(
                        "flex items-center gap-2 transition-opacity",
                        isPendingDelete && documentToDelete === doc.document.id
                          ? "opacity-40 text-red-600"
                          : ""
                      )}
                    >
                      <Image
                        src={`/images/${getFileIcon({
                          name: `logo.${doc.document.type}`,
                        })}`}
                        alt={doc.document.type.toString()}
                        width={100}
                        height={100}
                        className="h-7 w-8"
                      />
                      <p>{doc.document.name}</p>
                    </div>
                    {/* actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <EditDocument documentName={doc.document.name} />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <DeleteDialog
                            entityName="Document"
                            entityId={doc.document.id}
                            onDelete={handleDocumentDelete}
                            entityDescription={doc.document.name}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            )}
          </div>
        </div>
        <Separator orientation="vertical" className="hidden md:block" />

        <div className="hidden md:flex flex-1 py-4 px-6 h-[calc(100vh-80px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
