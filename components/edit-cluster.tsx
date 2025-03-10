import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import EditClusterDialog from "./edit-cluster-dialog";
import { Form } from "./ui/form";

const formSchema = z.object({
  clusterName: z.string().min(1, { message: "Cluster name is required" }),
});

export default function EditCluster({ clusterName, isDropDown }: { clusterName: string, isDropDown?: boolean | true }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clusterName: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    alert("Cluster name: " + values.clusterName);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="editClusterForm">
        {!isDropDown ? (
            <EditClusterDialog clusterName={clusterName} loading={loading} />
        ) : (
          <DropdownMenuItem asChild>
            <EditClusterDialog clusterName={clusterName} loading={loading} />
          </DropdownMenuItem>
        )}
      </form>
    </Form>
  );
}
