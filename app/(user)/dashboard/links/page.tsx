/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";
import { Input } from "../../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import React, { useState } from "react";
import { Separator } from "../../../../components/ui/separator";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../../../../components/ui/button";
// import { linksData } from "../../../../lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import EditClusterList from "../../../../components/edit-cluster-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "../../../../components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

interface LinkProps {
  id: string; // Unique identifier (UUID)
  url: string; // Generated URL
  trackingId?: string; // Optional tracking ID
  profileDescription: string; // Profile description text
  backgroundColor: string; // Background color class
  clusterId: string; // Unique identifier for the cluster
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
  cluster: {
    name: string; // Name of the cluster
  };
}


const columns: ColumnDef<LinkProps>[] = [
  // {
  //   accessorKey: "name",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Name <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("name")}</div>
  //   ),
  // },
  {
    accessorKey: "cluster",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cluster <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.cluster.name}</div>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <a
        href={row.getValue("url")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {row.getValue("url")}
      </a>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-gray-500">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
  // {
  //   accessorKey: "expiresAt",
  //   header: "Expires At",
  //   cell: ({ row }) => {
  //     const expiresAt = row.original;
  //     return expiresAt ? (
  //       <div className="text-red-500">
  //         {new Date(expiresAt).toLocaleDateString()}
  //       </div>
  //     ) : (
  //       <span className="text-gray-400">No Expiry</span>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "isActive",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <span
  //       className={`px-2 py-1 text-xs font-medium rounded-full ${
  //         row.getValue("isActive")
  //           ? "bg-green-200 text-green-700"
  //           : "bg-red-200 text-red-700"
  //       }`}
  //     >
  //       {row.getValue("isActive") ? "Active" : "Inactive"}
  //     </span>
  //   ),
  // },
  // {
  //   accessorKey: "clickCount",
  //   header: "Clicks",
  //   cell: ({ row }) => (
  //     <div className="text-center">{row.getValue("clickCount") || 0}</div>
  //   ),
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Edit Cluster */}
            <DropdownMenuItem asChild>
              <EditClusterList />
            </DropdownMenuItem>

            {/* Delete */}
            <DropdownMenuItem
              onClick={() => alert("Delete clicked")}
              className="group"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex gap-2 group-hover:text-[red]"
                  >
                    <Trash size={16} />
                    <span>Delete cluster</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Confirm Deletion of cluster</DialogHeader>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function MyLinks() {
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const {data: linksData} = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      if (user?.id) {
        const response = await fetch(`/api/links?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch links.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
    enabled: !!user?.id,
  });

  const table = useReactTable({
    data: [
      {
        "id": "0caddcb4-8ec6-42d8-a0df-a805f1732a65",
        "url": "http://192.168.19.114:3000/d/Kelly Toroitich/0caddcb4-8ec6-42d8-a0df-a805f1732a65",
        "trackingId": null,
        "profileDescription": "👋 Welcome to my profile! Open to connections, collaboration, and new ideas. Let's make great things happen together. 🌟",
        "backgroundColor": "bg-amber-50",
        "clusterId": "0caddcb4-8ec6-42d8-a0df-a805f1732a65",
        "createdAt": "2025-03-20T20:31:55.992Z",
        "updatedAt": "2025-03-24T11:09:30.788Z",
        "cluster": {
          "name": "Testingss"
        }
      },
      {
        "id": "3a9b6fa3-b897-4425-b7a2-ee99bc0824fc",
        "url": "http://192.168.19.114:3000/d/Kelly Toroitich/3a9b6fa3-b897-4425-b7a2-ee99bc0824fc",
        "trackingId": null,
        "profileDescription": "👋 Welcome to my profile! Open to connections, collaboration, and new ideas. Let's make great things happen together. 🌟",
        "backgroundColor": "bg-slate-50",
        "clusterId": "3a9b6fa3-b897-4425-b7a2-ee99bc0824fc",
        "createdAt": "2025-03-22T12:09:05.682Z",
        "updatedAt": "2025-03-24T11:09:51.084Z",
        "cluster": {
          "name": "Kelly Toroitich"
        }
      },
      {
        "id": "9a0f8e24-866e-4af2-9bb8-2fdfcda21944",
        "url": "http://192.168.19.114:3000/d/Kelly Toroitich/9a0f8e24-866e-4af2-9bb8-2fdfcda21944",
        "trackingId": null,
        "profileDescription": "👋Creative and detail-oriented software engineer, below are all my documents🔗",
        "backgroundColor": "bg-sky-50",
        "clusterId": "9a0f8e24-866e-4af2-9bb8-2fdfcda21944",
        "createdAt": "2025-03-20T13:36:08.583Z",
        "updatedAt": "2025-03-24T11:10:01.245Z",
        "cluster": {
          "name": "Testing"
        }
      },
      {
        "id": "dcfa2420-1215-4d1b-bcaa-7b1fe9f7d975",
        "url": "http://192.168.25.176:3000/d/Kelly%20Toroitich/dcfa2420-1215-4d1b-bcaa-7b1fe9f7d975",
        "trackingId": "dzzxc",
        "profileDescription": "👋 Welcome to my profile! Open to connections, collaboration, and new ideas. Let's make great things happen together. 🌟",
        "backgroundColor": "bg-amber-50",
        "clusterId": "dcfa2420-1215-4d1b-bcaa-7b1fe9f7d975",
        "createdAt": "2025-03-26T21:14:26.108Z",
        "updatedAt": "2025-03-26T21:14:26.108Z",
        "cluster": {
          "name": "Trackings"
        }
      },
      {
        "id": "0327685b-47db-49c5-af0b-cb6ecb5f100d",
        "url": "http://192.168.25.176:3000/d/Kelly%20Toroitich/0327685b-47db-49c5-af0b-cb6ecb5f100d",
        "trackingId": "00yxc",
        "profileDescription": "👋 Welcome to my profile! Open to connections, collaboration, and new ideas. Let's make great things happen together. 🌟",
        "backgroundColor": "bg-amber-50",
        "clusterId": "0327685b-47db-49c5-af0b-cb6ecb5f100d",
        "createdAt": "2025-03-26T21:17:06.961Z",
        "updatedAt": "2025-03-26T21:17:06.961Z",
        "cluster": {
          "name": "Tracks"
        }
      }
    ],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="max-h-screen overflow-y-scroll md:overflow-hidden md:overflow-y-scroll">
      <header className="flex flex-col sm:flex-row justify-between items-start py-4 px-4 sm:px-6 gap-4 w-screen md:w-full">
        <div>
          <h1 className="text-lg font-semibold">My Links</h1>
          <p className="text-[0.8rem] text-muted-foreground">
            Here&apos;s a table showing all the links you have created
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="flex items-center border rounded-lg focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-[300px]">
            <Input
              type="text"
              placeholder="Filter clusters..."
              className="p-2 w-full text-sm outline-none border-none"
              value={
                (table.getColumn("cluster")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("cluster")?.setFilterValue(e.target.value)
              }
            />
            <div className="p-2">
              <Search size={16} />
            </div>
          </div>

          {/* Column Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Separator />

      {/* Table Container */}
      <div className="p-2 sm:p-4 overflow-auto h-full w-screen md:w-full">
        <div className="h-auto p-0 border rounded-lg">
          <div className="overflow-x-auto">
            <Table className="table-auto min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-xs sm:text-sm">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer dark:hover:bg-secondary"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-xs sm:text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center text-xs sm:text-sm"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Responsive Pagination */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 py-4 px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-xs sm:text-sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
