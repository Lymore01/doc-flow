import { Plus } from "lucide-react";
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
import Dropzone from "./dropzone";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const documentSchema = z.object({
  document: z.any(),
});

export default function UploadDocument() {
  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      document: null,
    },
  });

  function onSubmit(values: z.infer<typeof documentSchema>) {
    console.log("Uploaded Document", values.document);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="documentForm">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"secondary"}
              className="w-fit flex items-center justify-start"
            >
              <Plus />
              <span>Upload Document</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Upload a document</DialogTitle>
              <DialogDescription>
                Click to select a file or drag and drop it here to upload.
              </DialogDescription>
            </DialogHeader>
            <Separator />

            <FormField
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="document">Document</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={async (acceptedFiles) => {
                        console.log("Dropped File:", acceptedFiles[0]);
                        if (acceptedFiles[0]) {
                          field.onChange(acceptedFiles[0]);
                        }
                      }}
                      accept={{
                        "application/pdf": [],
                        "application/msword": [],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                          [],
                        "application/vnd.ms-excel": [],
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                          [],
                        "text/plain": [],
                        "text/markdown": [],
                      }}
                      form={form}
                    ></Dropzone>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter>
              <Button variant={"secondary"} type="submit" form="documentForm">
                <span>Submit</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
