"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const Signup = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full flex items-center justify-center mt-6">
      <SignUp
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};

export default Signup;
