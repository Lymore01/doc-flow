"use client";

import { useParams, useRouter } from "next/navigation";
import { Separator } from "../../../../../components/ui/separator";
import { Button } from "../../../../../components/ui/button";
import {
  ChevronDown,
  Clipboard,
  CopyIcon,
  Edit,
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
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="text-lg py-4 px-6 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center justify-between w-full md:w-auto">
          <span className="text-xl font-semibold">Cluster {clusterId}</span>
          <Button variant={"secondary"} className="flex md:hidden gap-2">
            <Edit />
            <span>Edit</span>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center border rounded-lg w-full md:w-auto">
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

          <Separator orientation="vertical" className="hidden md:block" />

          <Button
            variant="secondary"
            className="w-full md:w-auto flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            <span>Reload</span>
          </Button>

          <UploadDocument />

          <Separator orientation="vertical" className="hidden md:block" />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Clipboard size={16} />
                <span>Get Url</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get Url</DialogTitle>
                <DialogDescription>
                  This Url contains all the documents in cluster {clusterId}
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
                  <p className="text-sm">docX.io/kellylimo</p>
                  <Button
                    variant="secondary"
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
            {filteredDocs.length === 0 ? (
              <div className="p-4 flex items-center justify-center">
                <span className="text-sm">Oops, Document Not Found!</span>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div key={doc.id}>
                  <div
                    className="flex items-center justify-between gap-4 text-sm hover:font-semibold transition-all cursor-pointer px-4"
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
        <Separator orientation="vertical" className="hidden md:block" />

        <div className="hidden md:flex flex-1 py-4 px-6 h-[calc(100vh-80px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
