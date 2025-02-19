"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";

const formSchema = z.object({
  image: z.string().optional(),
  username: z.string().min(1, { message: "Username is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  bio: z.string().min(1, { message: "Bio is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  socialMedia: z.string().min(1, { message: "Social media is required" }),
});

export default function Settings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      occupation: "",
      phoneNumber: "",
      location: "",
      website: "",
      socialMedia: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex justify-between items-center py-4 px-6">
        <h1>Settings</h1>
        <Button variant={"secondary"}>Preview profile</Button>
      </header>

      <Separator />

      {/* profile */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full flex-1 overflow-auto p-4"
        >
          <Card className="rounded-lg shadow-lg border flex flex-col h-screen">
            <CardHeader className="flex">
              <CardTitle className="flex justify-between items-center text-lg font-medium">
                Profile Information
                <Button variant="outline" type="button" className="text-sm">
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="flex flex-col items-start gap-3 w-full">
                  <Image
                    src={"/images/profile.jpg"}
                    width={120}
                    height={120}
                    alt="Profile Image"
                    className="w-24 h-24 rounded-full object-cover border-2"
                  />
                  <Button variant="secondary" size="sm">
                    Change Image
                  </Button>
                  <div className="flex w-full gap-3 flex-col">
                    <FormField
                      name="username"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Choose a unique username"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be visible in your profile link.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="firstName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="lastName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Second Column */}
                <div className="space-y-4 w-full">
                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="bio"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tell us about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="occupation"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your profession"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="location"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your city or country"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="website"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="Your personal website"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="socialMedia"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Media Links</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your LinkedIn, Twitter, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-6">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
