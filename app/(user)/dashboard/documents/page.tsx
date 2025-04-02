/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Filter, Search } from "lucide-react";
import { Separator } from "../../../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

import DocumentCard from "../../../../components/document-card";
import { CLUSTERS, DOCS } from "../../../../lib/constants";
import { useSidebar } from "../../../../components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { formatDate } from "../../../../lib/utils";
import { Skeleton } from "../../../../components/ui/skeleton";

export default function MyDocuments() {
  const router = useRouter();
  const { user } = useUser();
  const [documentName, setDocumentName] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const { state } = useSidebar();

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  // fetch all docs
  const { data: DOCS, isLoading } = useQuery({
    queryKey: ["viewDocuments", user?.id],
    queryFn: async () => {
      if (user?.id) {
        const response = await fetch(`/api/documents?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch document.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
    enabled: !!user?.id,
  });

  const filteredDocs =
    DOCS?.documents.filter(
      (doc: {
        cluster: {
          name: string;
          id: string;
        };
        document: {
          id: string;
          name: string;
          type: string;
          createdAt: string;
        };
      }) => {
        const matchesName = doc.document.name
          .toLowerCase()
          .includes(documentName.toLowerCase());

        if (!selectedFilter || selectedFilter === "all") {
          return matchesName;
        }

        function isDocumentRecent(createdAt: string) {
          const formattedCreatedAt = formatDate(
            new Date(createdAt).toISOString()
          );
          const oneWeekAgo = formatDate(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

          return formattedCreatedAt >= oneWeekAgo;
        }

        if (selectedFilter === "recent") {
          return matchesName && isDocumentRecent(doc.document.createdAt);
        }

        return (
          matchesName &&
          doc.document.name.toLowerCase().endsWith(selectedFilter)
        );
      }
    ) || [];

  useEffect(() => {
    if (selectedFilter) {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      searchParams.set("filterBy", selectedFilter);

      router.replace(`${url.pathname}?${searchParams.toString()}`, undefined);
    }
  }, [selectedFilter, router]);

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center py-4 px-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold">My Documents</h1>
            <p className="text-[0.8rem] text-muted-foreground">
              Here&apos;s a list of all documents you have uploaded
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto mt-3 sm:mt-0">
            <div className="flex items-center border rounded-lg focus-within:ring-2  w-full sm:w-auto">
              <Input
                placeholder="Search documents..."
                className="flex-1 px-3 py-2 text-sm border-none outline-none focus:ring-0"
                value={documentName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDocumentName(event.target.value);
                }}
              />
              <div className="p-2">
                <Search size={16} />
              </div>
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom" align="start" className="w-40">
                <DropdownMenuItem onClick={() => handleFilterSelect("all")}>
                  All Documents
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFilterSelect("pdf")}>
                  PDFs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect("docx")}>
                  Word Docs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect("xlsx")}>
                  Excel Sheets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect("txt")}>
                  Text Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect("pptx")}>
                  Powerpoint
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFilterSelect("recent")}>
                  Recently Uploaded
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Separator */}
        <Separator />

        {/* Document Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {isLoading ? (
              Array.from({length: 3}).map((_, idx)=>(
              <div className="rounded-md w-full h-[200px] flex flex-col border border-gray-200 bg-white shadow-sm" key={idx}>
                {/* Header Section */}
                <div className="h-1/4 flex items-center justify-center bg-secondary rounded-t-md p-4">
                  <Skeleton className="w-28 h-6" />
                </div>

                <Separator />

                <div className="flex flex-1 flex-col gap-4 p-4">
                  <Skeleton className="w-3/4 h-[80px] rounded-lg" />
                  <div className="flex justify-end items-end gap-2">
                    <Skeleton className="w-12 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </div>
              </div>

              ))
            ) : (
              filteredDocs?.length === 0 && (
                <span className="text-gray-500">No results found</span>
              )
            )}
            {filteredDocs.map(
              (doc: {
                cluster: {
                  id: string;
                  name: string;
                };
                document: {
                  id: string;
                  name: string;
                  type: string;
                  createdAt: string;
                  url: string;
                };
              }) => (
                <DocumentCard
                  id={doc.document.id}
                  name={doc.document.name}
                  type={doc.document.name.split(".").pop()?.toLowerCase()}
                  size="1.2MB"
                  date={doc.document.createdAt}
                  url={doc.document.url}
                  key={doc.document.id}
                  cluster={doc.cluster?.name}
                  clusterId={doc.cluster.id}
                  clusters={DOCS?.documents.map(
                    (doc: {
                      clusterId: string;
                      cluster: {
                        name: string;
                      };
                    }) => ({
                      clusterId: doc.clusterId,
                      clusterName: doc.cluster.name,
                    })
                  )}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
