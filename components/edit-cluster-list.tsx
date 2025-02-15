import { useForm } from "react-hook-form";
import MoveDocuments from "./move-documents";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Edit } from "lucide-react";

const formSchema = z.object({
  clusterName: z.string().min(1, { message: "Cluster name is required" }),
});

export default function EditClusterList() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clusterName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="editClusterListForm">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full flex gap-2">
              <Edit size={16} />
              <span>Edit cluster</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Cluster</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="flex flex-col gap-2">
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
              <MoveDocuments />
            </div>
            <Separator />
            <DialogFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button
                variant="secondary"
                type="submit"
                form="editClusterListForm"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
