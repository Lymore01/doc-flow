import {
  Form,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import EditDocumentDialog from "./edit-document-dialog";

const formSchema = z.object({
  documentName: z.string().min(1, { message: "Document name is required" }),
});

export default function EditDocument({
  documentName,
  isDropDown,
}: {
  documentName: string;
  isDropDown?: boolean | true;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentName: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log("Document name: ", values);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="editDocumentForm">
        {!isDropDown ? (
          <EditDocumentDialog documentName={documentName} loading={loading} />
        ) : (
          <DropdownMenuItem asChild>
            <EditDocumentDialog documentName={documentName} loading={loading} />
          </DropdownMenuItem>
        )}
      </form>
    </Form>
  );
}
