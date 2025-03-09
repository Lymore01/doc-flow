/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from "lucide-react";
import { CLUSTER_CATEGORIES } from "../lib/constants";
import Selection from "./selection";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export interface ClusterCategoryProps {
  id: number;
  name: string;
}

export default function AddClusterForm({
  form,
  onSubmit,
  loading
}: {
  form: any;
  onSubmit: (values: any) => void;
  loading: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clusterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">
                Cluster Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter cluster name"
                  {...field}
                  className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>
                Cluster name should only contain: numbers, hyphen and string
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clusterCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="clusterCategory">Cluster Category</FormLabel>
              <FormControl>
                <Selection
                  items={CLUSTER_CATEGORIES.map(
                    (category: ClusterCategoryProps) => category.name
                  )}
                  onValueChange={(value: string) => {
                    const category = CLUSTER_CATEGORIES.find(
                      (obj: ClusterCategoryProps) =>
                        obj.name.toLowerCase() === value.toLowerCase()
                    );
                    if (category) {
                      field.onChange(category.name);
                    }
                  }}
                  label={"Category"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <DialogFooter className="flex flex-row items-center justify-between md:justify-end gap-2">
          <Button variant={"outline"}>Cancel</Button>
          <Button variant={"secondary"} className="bg-blue-600 text-white" disabled={loading}>
            {loading ? <div className="flex gap-2 items-center"><Loader2 className="animate-spin"/><span>Saving</span></div> : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
