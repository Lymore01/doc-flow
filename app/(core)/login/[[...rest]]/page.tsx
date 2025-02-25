"use client";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark, neobrutalism } from "@clerk/themes";

const Login = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full flex items-center justify-center mt-6">
      <SignIn
        appearance={{
          baseTheme: theme === "dark" ? dark : neobrutalism,
        }}
      />
    </div>
  );
};

export default Login;
