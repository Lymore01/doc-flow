import { useState } from "react";
import { DOCS } from "../lib/constants";
import { Grip } from "lucide-react";

interface ItemProp {
  id: number,
  name: string,
  type:string,
  logo:string
}

export default function MoveDocuments() {
  const [draggedItem, setDraggedItem] = useState<ItemProp | null>(null);
  const [Items, setItems] = useState<ItemProp[]>(DOCS);

  const handleDragStart = (item:ItemProp) => {
    setDraggedItem(item);
  };

  const handleDragOver = (event:React.DragEvent<HTMLDivElement>, item:ItemProp) => {
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

  const handleDrop = (event:React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="mt-4">
      {Items.map((doc) => (
        <div
          key={doc.id}
          className="flex gap-2 items-center"
          draggable
          onDragOver={(event) => handleDragOver(event, doc)}
          onDrop={(event)=>handleDrop(event)}
          onDragStart={() => handleDragStart(doc)}
          onDragEnd={handleDragEnd}
        >
          <Grip className="cursor-pointer" size={16} />
          <div className="flex items-center justify-between gap-4 text-sm cursor-pointer bg-secondary p-2 rounded mb-2">
            <div className="flex items-center gap-2">
              <p>{doc.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
