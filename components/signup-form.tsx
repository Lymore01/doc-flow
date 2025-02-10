/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

export default function SignupForm({
  form,
  onSubmit,
}: {
  form: any;
  onSubmit: (values: any) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 ">
      <div className="w-full max-w-md bg-white dark:bg-card-dark shadow-lg rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to <span className="text-blue-600">docX</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Create an account</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* fullname */}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your Email Address"
                      {...field}
                      className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2 text-gray-400"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms & Conditions */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id="terms"
                    />
                  </FormControl>
                  <FormLabel
                    className="flex h-full items-center"
                    htmlFor="terms"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-500 underline">
                      Terms & Conditions
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-primary dark:bg-background-light dark:text-primary transition hover:bg-primary w-full"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
