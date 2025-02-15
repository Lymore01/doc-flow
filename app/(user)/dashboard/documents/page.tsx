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

export default function MyDocuments() {
  const router = useRouter();
  const [documentName, setDocumentName] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const { state } = useSidebar();

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredDocs = DOCS.filter((doc) => {
    const matchesName = doc.name
      .toLowerCase()
      .includes(documentName.toLowerCase());

    if (!selectedFilter || selectedFilter === "all") {
      return matchesName;
    }

    if (selectedFilter === "recent") {
      return (
        matchesName &&
        new Date(doc.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    }

    return matchesName && doc.name.toLowerCase().endsWith(selectedFilter);
  });

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
      <div className="">
        <header className="flex justify-between items-center py-4 px-6">
          <h1>My Documents</h1>
          <div className="flex gap-2 items-center">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFilterSelect("recent")}>
                  Recently Uploaded
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Separator />
        {/* docs grid */}
        <div
          className={`transition-all duration-300 ${
            state.valueOf() === "expanded" ? "ml-0" : "ml-0"
          } p-4`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 w-full">
            {filteredDocs.length === 0 && <span>No results found</span>}
            {filteredDocs.map((doc) => (
              <DocumentCard
                name={doc.name}
                type={doc.name.split(".").pop()?.toLowerCase()}
                size="1.2MB"
                date="Feb 10, 2025"
                url="https://example.com/project-details.pdf"
                key={doc.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
