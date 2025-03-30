/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  Search,
  Trash,
  TrendingUpDown,
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
import { useRouter } from "next/navigation";
import { TrackerProps } from "../../../../components/user-tracker-table";

interface LinkProps {
  id: string; // Unique identifier (UUID)
  Clicks: TrackerProps[]
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



export default function MyLinks() {
  const { user } = useUser();
  const router = useRouter();
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

  const { data: linksData } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      if (user?.id) {
        const response = await fetch(`/api/links?userId=${user?.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch links.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
    enabled: !!user?.id,
  });

  const columns: ColumnDef<LinkProps>[] = [
    {
      accessorKey: "cluster.name",
      id: "clusterName",
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
    {
      accessorKey: "Clicks",
      header: "Clicks",
      cell: ({ row }) => (
        <div className="text-center">{row.original.Clicks.length}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Edit Cluster */}
              <DropdownMenuItem asChild
              onClick={() => {
                router.push(`/dashboard/cluster/${row.original.clusterId}`)
              }
              }
              >
                {/* <EditClusterList /> */}
                <Button variant="ghost" className="w-full flex gap-2 p-2">
                  <Eye size={16} />
                  <span>View Cluster</span>
                </Button>
              </DropdownMenuItem>
  
              {/* Delete */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
               onClick={() => {
                router.push(`/dashboard/analytics?cluster=${row.original.cluster.name}`)
              }}
                className="group"
              >
                <Button variant="ghost" className="w-full flex gap-2 p-2">
                  <TrendingUpDown size={16} />
                  <span>View Analytics</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: linksData?.links || [],
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
                (table.getColumn("clusterName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("clusterName")?.setFilterValue(e.target.value)
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
                        <TableCell
                          key={cell.id}
                          className="text-xs sm:text-sm max-w-[170px] md:w-auto truncate"
                        >
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
