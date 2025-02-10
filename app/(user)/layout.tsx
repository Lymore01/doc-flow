import { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { BarChart, Folder, Home, Link, Settings } from "lucide-react";
import AppSideBar from "../../components/app-sidebar";
import ThemeSwitch from "../../components/theme";

export const metadata: Metadata = {
  title: "DocX",
  description: "User Dashboard",
};

export default function UserRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSideBar
        items={[
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: <Home />,
          },
          {
            title: "My Documents",
            url: "/documents",
            icon: <Folder />,
          },
          {
            title: "My Links",
            url: "/links",
            icon: <Link />,
          },
          {
            title: "Analytics",
            url: "/analytics",
            icon: <BarChart />,
          },
          {
            title: "Settings",
            url: "/settings",
            icon: <Settings />,
          },
        ]}
      />
      <main className="flex-1">
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger />
          <ThemeSwitch />
        </div>
        <div className="px-4 py-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
