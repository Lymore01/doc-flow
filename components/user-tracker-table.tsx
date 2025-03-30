import { Button } from "./ui/button";
import { ArrowUpDown, ChevronDown, Search } from "lucide-react";
import React from "react";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

// todo: add location in future versions
// location, ip, device type, click count, date/time of click

export interface TrackerProps {
  ip: string;
  country: string;
  userAgent: string;
  createdAt: string;
}

const columns: ColumnDef<TrackerProps>[] = [
  {
    accessorKey: "ip",
    header: "Ip",
    cell: ({ row }) => <div className="font-medium">{row.getValue("ip")}</div>,
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Country <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("country")}</div>
    ),
  },
  {
    accessorKey: "userAgent",
    header: "Device Type",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userAgent")}</div>
    ),
  },
  // {
  //   accessorKey: "clickCount",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Clicks <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("clickCount")}</div>
  //   ),
  // },
  {
    accessorKey: "createdAt",
    header: "Clicked At",
    cell: ({ row }) => (
      <div className="text-gray-500">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
];

export default function UsersTrackerTable() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const cluster = searchParams.get("cluster");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  const filteredData = linksData?.links
    .filter((link: { cluster: { name: string } }) => {
      return link.cluster.name === cluster ? decodeURIComponent(cluster) : "";
    })[0]
    .Clicks.map((link: TrackerProps) => ({
      ip: link.ip,
      country: link.country,
      userAgent: link.userAgent,
      createdAt: link.createdAt,
    }));

  const table = useReactTable({
    data: filteredData || [],
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
    <div className="flex flex-col gap-4 border rounded-lg p-4">
      <div className="flex gap-2 items-center">
        <div className="flex justify-between items-center border rounded-lg focus-visible:ring-1 focus-visible:ring-ring">
          <Input
            type="text"
            placeholder="Filter locations..."
            className="p-2 w-full sm:w-[300px] text-sm outline-none border-none"
            value={
              (table.getColumn("country")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("country")?.setFilterValue(e.target.value)
            }
          />
          <div className="p-2">
            <Search size={16} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* table */}
      <div className="h-auto p-0 border rounded-lg">
        <div className="overflow-x-auto">
          <Table className="table-auto min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer dark:hover:bg-secondary"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                  <TableCell colSpan={columns.length} className="text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
