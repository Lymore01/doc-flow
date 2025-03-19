import { useState, useEffect } from "react";
import { Grip, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

interface DocProps {
  document: {
    id: string;
    name: string;
    type: string;
    url: string;
  };
}

export default function MoveDocuments() {
  const [draggedItem, setDraggedItem] = useState<DocProps | null>(null);
  const [Items, setItems] = useState<DocProps[]>([]);

  const { user } = useUser();
  const { clusterId } = useParams();

  const {
    data: fetchedDocuments,
    isLoading,
    error,
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

  useEffect(() => {
    if (fetchedDocuments) {
      setItems(fetchedDocuments.documents);
    }
  }, [fetchedDocuments]);

  const handleDragStart = (item: DocProps) => {
    setDraggedItem(item);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    item: DocProps
  ) => {
    const draggedOver = Items.indexOf(item);
    event.preventDefault();
    const draggedIndex = draggedItem ? Items.indexOf(draggedItem) : null;
    if (draggedIndex !== draggedOver) {
      const updatedItems = [...Items];
      if (draggedIndex) {
        [updatedItems[draggedIndex], updatedItems[draggedOver]] = [
          updatedItems[draggedOver],
          updatedItems[draggedIndex],
        ];
      }
      setItems(updatedItems);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (error) return <span>Error fetching documents</span>;

  return (
    <div className="mt-4">
      {isLoading && (
        <div className="w-full h-[100px] flex justify-center items-center">
          <Loader2 className="animate-spin stroke-blue-600" size={36} />
        </div>
      )}
      {Items.length === 0 && (
        <div className="w-full h-[100px] flex items-center justify-center">
          <span>No documents found!</span>
        </div>
      )}
      {Items.map((doc: DocProps) => (
        <div
          key={doc.document.id}
          className="flex gap-2 items-center"
          draggable
          onDragOver={(event) => handleDragOver(event, doc)}
          onDrop={(event) => handleDrop(event)}
          onDragStart={() => handleDragStart(doc)}
          onDragEnd={handleDragEnd}
        >
          <Grip className="cursor-pointer" size={16} />
          <div className="flex items-center justify-between gap-4 text-sm cursor-pointer bg-secondary p-2 rounded mb-2">
            <div className="flex items-center gap-2">
              <p>{doc.document.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
