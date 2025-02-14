"use client";

import { useParams, useRouter } from "next/navigation";
import { Separator } from "../../../../../components/ui/separator";
import { Button } from "../../../../../components/ui/button";
import {
  ChevronDown,
  Clipboard,
  CopyIcon,
  EllipsisVertical,
  RefreshCcw,
  Search,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import { DOCS } from "../../../../../lib/constants";
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

export default function ClusterPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { clusterId } = useParams();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState<string>("");

  const filteredDocs = DOCS.filter((doc) =>
    doc.name.toLowerCase().includes(documentName.toLowerCase())
  );

  // TODO: fetch from db
  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="text-lg py-4 px-6 flex justify-between items-center">
        Cluster {clusterId}
        <div className="flex items-center gap-2 w-auto">
          <div className="flex justify-between items-center border rounded-lg focus-visible:ring-1 focus-visible:ring-ring">
            <Input
              placeholder="Search documents..."
              className="placeholder:text-sm border-none outline-none focus-visible:ring-0"
              value={documentName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDocumentName(event.target.value);
              }}
            />
            <div className="p-2">
              <Search size={16} />
            </div>
          </div>
          <Separator orientation="vertical" />
          <Button
            variant={"secondary"}
            className="w-fit flex items-center justify-start h-auto"
          >
            <RefreshCcw />
            {/* refetch from the database */}
            <span>Reload</span>
          </Button>

          {/* upload doc */}
          <UploadDocument />
          <Separator orientation="vertical" />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"secondary"}
                className="w-fit flex items-center justify-start bg-primary text-primary-foreground hover:text-primary-dark dark:bg-[#2563EB]"
              >
                <Clipboard />
                <span>Get Url</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get Url</DialogTitle>
                <DialogDescription>This Url contains all the documents in cluster {clusterId}</DialogDescription>
              </DialogHeader>
              <Separator />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="edit"
                  className="border-none transition-transform"
                >
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
                  {/* url */}
                  <p className="text-sm">docX.io/kellylimo</p>
                  <Button
                    variant={"secondary"}
                    onClick={() => {
                      toast({
                        title: "Success",
                        description: "Link Copied Successfully",
                        variant: "default",
                      });
                    }}
                  >
                    <CopyIcon size={16} />
                    <span>Copy Url</span>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" />
        </div>
      </div>
      <Separator />
      {/* main content */}
      <div className="h-screen flex">
        {/* list */}
        <div className="w-1/4">
          <div className="py-4 px-6 ">
            <h1 className="text-lg">Documents</h1>
          </div>

          <Separator />
          <div className="py-4 space-y-4">
            {filteredDocs.length === 0 ? (
              <div className="p-4 flex items-center justify-center">
                <span className="text-sm">Oops, Document Not Found!</span>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div key={doc.id}>
                  <div
                    className="flex items-center justify-between gap-4 text-sm hover:font-semibold transition-all cursor-pointer pl-4"
                    onClick={() => {
                      router.push(
                        `/dashboard/cluster/${clusterId}/document/${doc.id}`
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={doc.logo}
                        alt={doc.type}
                        width={100}
                        height={100}
                        className="h-7 w-8"
                      />
                      <p>{doc.name}</p>
                    </div>
                    {/* actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <EditDocument documentName={doc.name} />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="group">
                          <span className="flex gap-2 w-full group-hover:text-[red]">
                            <Trash size={16} />
                            <span>Delete</span>
                          </span>
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
        <Separator orientation="vertical" />

        <div className="flex-1 py-4 px-6 h-[calc(100vh-80px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
