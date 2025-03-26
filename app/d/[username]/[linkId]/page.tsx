/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Check, Edit, ExternalLink, Loader2, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Document } from "../../../../components/types/types";
import { cn, getFileIcon } from "../../../../lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Separator } from "../../../../components/ui/separator";
import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../../../components/ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AxiosError } from "axios";
import { toast } from "../../../../hooks/use-toast";

const formSchema = z.object({
  profileDescription: z.string().optional(),
  backgroundColor: z.string().optional(),
});

const lightBgColors = [
  "bg-pink-100", // Light Pink
  "bg-blue-100", // Baby Blue
  "bg-green-100", // Mint Green
  "bg-purple-100", // Lavender
  "bg-yellow-100", // Soft Lemon
  "bg-gray-100", // Light Gray
  "bg-rose-50", // Blush Pink
  "bg-amber-50", // Very Light Amber
  "bg-slate-50", // Soft Whiteish Gray
  "bg-emerald-50", // Pale Green
  "bg-sky-50", // Very Light Sky Blue
  "bg-teal-50", // Light Teal
  "bg-lime-50", // Soft Lime
];

export default function UserPage() {
  const { linkId } = useParams();
  const { user } = useUser();
  const [mediaPreview, setMediaPreview] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("bg-amber-50");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const { username } = useParams();

  const initialValues = useRef({
    profileDescription: "",
    backgroundColor: "bg-amber-50",
  });

  const queryClient = useQueryClient();
  const {
    data: userDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPageDetails", linkId],
    queryFn: async () => {
      if (linkId) {
        const response = await fetch(`/api/userpage?linkId=${linkId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user page details.");
        }
        return response.json();
      }
      throw new Error("Link ID is undefined.");
    },
    enabled: !!linkId,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileDescription: "",
      backgroundColor: "bg-amber-50",
    },
  });

  useEffect(() => {
    if (userDetails?.userPageDetails[0]?.link) {
      const { backgroundColor, profileDescription } =
        userDetails.userPageDetails[0].link;

      setSelectedColor(backgroundColor || "bg-amber-50");
      initialValues.current = {
        backgroundColor: backgroundColor || "bg-amber-50",
        profileDescription: profileDescription || "",
      };

      form.reset({
        profileDescription: profileDescription || "",
        backgroundColor: backgroundColor || "bg-amber-50",
      });
    }
  }, [form, userDetails]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        const response = await fetch(`/api/links/${linkId}`, {
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
      } catch {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof AxiosError) {
          errorMessage = error?.response?.data?.error || errorMessage;
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated Successfully!",
        description: "Profile has been changed successfully.",
      });

      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["userPageDetails"] });

      form.reset();
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Profile Description Update Failed",
        description: errorMessage,
      });
    },
  });

  useEffect(() => {
    const { dirtyFields } = form.formState;

    // const profileDescription = form.watch("profileDescription");
    const isChanged =
      dirtyFields.profileDescription ||
      selectedColor !== initialValues.current.backgroundColor;

    setIsButtonDisabled(!isChanged);
  }, [form, selectedColor]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutateAsync({
        profileDescription:
          values.profileDescription ||
          userDetails?.userPageDetails[0]?.link.profileDescription,
        backgroundColor:
          selectedColor ||
          userDetails?.userPageDetails[0]?.link.backgroundColor,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-full h-screen max-h-screen overflow-auto flex flex-col items-center justify-start p-6 md:p-12 ${selectedColor}`}
    >
      <div className="w-full justify-between items-center flex">
        <Link href="/">
          <Image
            src={"/images/docX-logo.png"}
            alt="docX"
            width={120}
            height={40}
            className="w-[90px] h-[60px] md:size-auto"
          />
        </Link>
        {/* edit profile - owners */}
        {user && user.id === userDetails?.userPageDetails[0]?.user.id && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <span className="flex gap-2 cursor-pointer items-center">
                <Edit size={16} />
                <span>Edit Profile</span>
              </span>
            </DialogTrigger>
            <DialogContent className={`${selectedColor} max-h-[90vh] overflow-auto overflow-y-scroll`}>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  id="editUserPage"
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="profileDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Description</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Tell us something about yourself"
                            className="w-full border rounded-md p-4 h-[200px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="gap-2">
                    <label className="text-sm">Color Pallet</label>
                    <div className="border p-2 grid grid-cols-4">
                      {lightBgColors.map((color, index) => (
                        <div
                          className={cn("size-24 relative", color)}
                          key={index}
                          onClick={() => {
                            setSelectedColor(color);
                          }}
                        >
                          {selectedColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </Form>
              <Separator />
              <DialogFooter className="flex flex-row justify-between">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant="secondary"
                  type="submit"
                  className="bg-blue-600 text-white"
                  form="editUserPage"
                  disabled={isPending || isButtonDisabled}
                >
                  {isPending ? (
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
        )}
      </div>
      {/* profile section */}
      <div className="flex flex-col gap-4 items-center justify-center mt-4">
        {userDetails?.userPageDetails[0]?.user ? ( //userDetails?.userPageDetails[0]?.user.image
          <Image
            src={"/images/profile.jpg"} //userDetails?.userPageDetails[0]?.user.image
            alt="profile pic"
            height={100}
            width={100}
            className="size-36 rounded-full border-0 p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            style={{
              backgroundClip: "padding-box",
            }}
          />
        ) : (
          <Skeleton className="size-36 rounded-full" /> //todo: replace this with placeholder image
        )}
        {userDetails?.userPageDetails[0]?.user ? (
          <h1 className="text-2xl font-bold dark:text-white text-gray-800 ">
            {userDetails?.userPageDetails[0]?.user.name
              ? decodeURIComponent(
                  typeof userDetails?.userPageDetails[0]?.user.name === "string"
                    ? userDetails?.userPageDetails[0]?.user.name
                    : userDetails?.userPageDetails[0]?.user.name
                )
              : "Unknown User"}
          </h1>
        ) : (
          <Skeleton className="h-8 w-32" />
        )}
        {userDetails?.userPageDetails[0]?.user ? (
          <>
            <p className="text-sm text-gray-600">
              {userDetails?.userPageDetails[0]?.user.email}
            </p>
            <p className="text-center text-sm text-gray-600 font-light">
              {userDetails?.userPageDetails[0]?.link.profileDescription}
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-46" />
          </div>
        )}
      </div>
      {/* documents section */}

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading &&
          Array.from([1, 2, 3, 4]).map((_, index) => (
            <div
              className="h-[200px] border p-2 flex flex-col gap-2 rounded-md items-center justify-center relative"
              key={index}
            >
              <Skeleton className="w-[100px] h-[100px] rounded-full" />

              <Skeleton className="h-6 w-32" />

              <div className="absolute top-0 right-0 p-2 size-auto">
                <Skeleton className="w-5 h-5 rounded-md" />
              </div>
            </div>
          ))}
        {error && <div>Error Loading Documents!</div>}
        {userDetails?.userPageDetails[0]?.link.cluster.documents?.length ===
          0 && (
          <div className="p-4 flex items-center justify-center w-full">
            <span className="text-sm text-center text-muted-foreground">
              Oops, nothing here!
            </span>
          </div>
        )}
        {userDetails?.userPageDetails[0]?.link.cluster.documents?.map(
          (doc: Document) => (
            <div
              className="h-[200px] border p-2 flex flex-col gap-2 rounded-md items-center justify-center relative"
              key={doc.document.id}
            >
              <Image
                src={`/images/${getFileIcon({
                  name: `logo.${doc.document.type}`,
                })}`}
                alt={doc.document.name}
                width={100}
                height={100}
                className="size-20"
              />
              <h1 className="text-sm">{doc.document.name}</h1>
              {/* view document */}
              <div
                className="absolute top-0 right-0 p-2 size-auto"
                onClick={() => {
                  // router.push(
                  //   `/dashboard/cluster/${clusterid}/document/${doc.document.id}`
                  // );
                  //Todo: replace this with public route
                }}
              >
                <ExternalLink size={18} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
