import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import EditClusterDialog from "./edit-cluster-dialog";
import { Form } from "./ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "../hooks/use-toast";
import { useParams } from "next/navigation";

const formSchema = z.object({
  clusterName: z.string().min(1, { message: "Cluster name is required" }),
});

export default function EditCluster({
  clusterName,
  isDropDown,
  cluster_id
}: {
  clusterName: string;
  isDropDown?: boolean | true;
  cluster_id?: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clusterName: "",
    },
  });

  const queryClient = useQueryClient()

  const { clusterId }  = useParams();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: { name: string }) => {
      try {
        const response = await fetch(`/api/clusters/${clusterId ? clusterId : cluster_id}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to upload document");
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
    onSuccess: () => {
      
      toast({
        title: "Cluster Name Updated Successfully!",
        description: "Cluster name has been changed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['clusters']});
      queryClient.invalidateQueries({ queryKey: ['clusterName']});
      
      form.reset();
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Cluster Name Update Failed",
        description: errorMessage,
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({
      name: values.clusterName,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="editClusterForm">
        {!isDropDown ? (
          <EditClusterDialog clusterName={clusterName} loading={isPending} />
        ) : (
          <DropdownMenuItem asChild>
            <EditClusterDialog clusterName={clusterName} loading={isPending} />
          </DropdownMenuItem>
        )}
      </form>
    </Form>
  );
}
