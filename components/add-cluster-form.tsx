/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function AddClusterForm({
    form,
    onSubmit,
  }: {
    form: any;
    onSubmit: (values: any) => void;
  }){
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clusterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Name Of Cluster
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter cluster name"
                      {...field}
                      className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription>Cluster name should only contain: numbers, hyphen and string</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
              <DialogFooter className="flex items-center justify-end gap-2">
                    <Button variant={"outline"}>Cancel</Button>
                    <Button variant={"secondary"}>Save</Button>
              </DialogFooter>
            </form>
        </Form>
    )
}