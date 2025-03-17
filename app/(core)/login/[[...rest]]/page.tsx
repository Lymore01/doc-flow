"use client";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const Login = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full flex items-center justify-center mt-6">
      <SignIn
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};

export default Login;
