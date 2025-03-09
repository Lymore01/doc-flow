/* eslint-disable @typescript-eslint/no-unused-vars */
import { Loader2, Plus } from "lucide-react";
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
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upload } from "../supabase/storage/client";
import { toast } from "../hooks/use-toast";
import { useState } from "react";

const documentSchema = z.object({
  url: z.any(),
});

export default function UploadDocument() {
  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      url: null,
    },
  });

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  async function onSubmit(values: z.infer<typeof documentSchema>) {
    try {
      setLoading(true);
      if (file === null) {
        toast({
          title: "No document selected",
          description: "Please select a document to upload.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { publicURL, error } = await upload({ file, bucket: "docx" });

      if (error) {
        toast({
          title: "Failed to upload document",
          description: error || "An unknown error occurred.",
          variant: "destructive",
        });
        return;
      }

      form.setValue("url", publicURL);

      setLoading(false);

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully!",
      });

      console.log("Document url", publicURL); //debug
    } catch (err) {
      toast({
        title: "Unexpected Error",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
      setLoading(false);
    } finally {
      setFile(null);
      form.reset();
      setLoading(false);
    }
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="url">Document</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={async (acceptedFiles) => {
                        console.log("Dropped File:", acceptedFiles[0]);
                        if (acceptedFiles[0]) {
                          setFile(acceptedFiles[0]);
                          field.onChange(acceptedFiles[0]);
                        }
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
              <Button
                variant={"secondary"}
                type="submit"
                form="documentForm"
                className="bg-blue-600 text-white"
                disabled={loading}
              >
                {loading ? <div className="flex gap-2 items-center"><Loader2 className="animate-spin"/><span>Uploading</span></div> : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
