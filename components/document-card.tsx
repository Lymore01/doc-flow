import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Download, Eye, FileText, FolderEdit, Trash } from "lucide-react";
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

interface DocumentCardProps {
  name: string;
  type: string | undefined;
  size: string;
  date: string;
  url: string;
}

export default function DocumentCard({
  name,
  type,
  size,
  date,
}: DocumentCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const handleMoveToCluster = (cluster: string) => {
    setSelectedCluster(cluster);
    console.log(`Moved "${name}" to "${selectedCluster}"`);
    // update the database with the new cluster
  };

  const handleFileDownload = () => {
    // make a get request to retrieve the file
  };

  const handleFileDelete = () => {
    // delete from the db and supabase
  };
  return (
    <Card className="rounded-md shadow-md">
      <CardHeader className="flex items-center justify-between p-4 border-b">
        <CardTitle className="text-sm font-semibold truncate">{name}</CardTitle>
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
            <p className="text-xs ">Uploaded: {date}</p>
            <p className="text-xs ">Cluster: School Reports</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex justify-end gap-2">
        <Sheet>
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
        </Sheet>

        <Button size="sm" variant="default" onClick={handleFileDownload}>
          <Download className="w-4 h-4 " />
        </Button>
        <Button size="sm" variant="destructive" onClick={handleFileDelete}>
          <Trash className="w-4 h-4 " />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Todo: ensure the document card actions and search filter (from the server) are working
