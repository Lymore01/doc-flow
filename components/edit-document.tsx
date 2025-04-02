import { Form } from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import EditDocumentDialog from "./edit-document-dialog";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const formSchema = z.object({
  documentName: z.string().min(1, { message: "Document name is required" }),
});

export default function EditDocument({
  documentName,
  isDropDown,
  documentId,
  type,
  url,
  clusterId,
}: {
  documentName: string;
  isDropDown?: boolean | true;
  documentId: string;
  type: string;
  url: string;
  clusterId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentName: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: {
      name: string;
      type: string;
      url: string;
      clusterId: string;
    }) => {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to edit document");
        }
        return response.json();
      } catch (error) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof AxiosError) {
          errorMessage = error?.response?.data?.error || errorMessage;
        }
        throw new Error(errorMessage);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({
      name: values.documentName,
      type: type,
      url: url,
      clusterId: clusterId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="editDocumentForm">
        {!isDropDown ? (
          <EditDocumentDialog documentName={documentName} loading={isPending} />
        ) : (
          <DropdownMenuItem asChild>
            <EditDocumentDialog
              documentName={documentName}
              loading={isPending}
            />
          </DropdownMenuItem>
        )}
      </form>
    </Form>
  );
}
