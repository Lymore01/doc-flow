import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { AlertOctagon, Loader2, Trash } from "lucide-react";
import { cn } from "../lib/utils";

type DeleteDialogProps = {
  entityName: string;
  entityId: string;
  onDelete: (id: string) => Promise<void>;
  isPendingDelete: boolean;
  entityDescription: string
};

export function DeleteDialog({ entityName, entityId, onDelete, isPendingDelete, entityDescription }: DeleteDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(entityId); 
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <span className="flex gap-2 w-full group-hover:text-[red] text-sm px-2 cursor-pointer">
          <Trash size={16} />
          <span>Delete {entityName}</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirm Deletion of &quot;{entityDescription}&quot;
          </DialogTitle>
        </DialogHeader>
        <Separator />
        {/* Alert */}
        <div className="flex p-4 gap-4 bg-red-900 rounded-lg border-2 border-red-500">
          <div className="py-1">
            <AlertOctagon size={16} stroke="red" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-red-300">
              This action cannot be undone.
            </h1>
            <p className="text-sm text-red-400">
              Are you sure you want to delete the selected {entityName}?
            </p>
          </div>
        </div>
        <Separator />
        <DialogFooter className="flex flex-row items-center justify-between md:justify-end gap-2">
          <Button
            variant={"outline"}
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant={"secondary"}
            className={cn("bg-red-600 text-white", isPendingDelete && "bg-red-600")}
            onClick={handleDelete}
            disabled={isPendingDelete}
          >
            {isPendingDelete ? (
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin"/>
                <span>Deleting</span>
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
