import { Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function EditClusterDialog({
  clusterName,
  loading
}: {
  clusterName: string;
  loading: boolean
}) {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
      >
        <span className="flex gap-2 cursor-pointer">
          <Edit size={16} />
          <span>Edit cluster</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Cluster</DialogTitle>
          <DialogDescription>
            Rename &quot;{clusterName}&quot;
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <FormField
          name="clusterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="clusterName">Cluster Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter new cluster name"
                  className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Separator />
        <DialogFooter className="flex flex-row items-center justify-between md:justify-end gap-2">
          <Button variant={"outline"}>Cancel</Button>
          <Button
            variant={"secondary"}
            type="submit"
            form="editClusterForm"
            className="bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin" />
                <span>Saving</span>
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
