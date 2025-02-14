import { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { BarChart, Folder, Home, Link, Settings } from "lucide-react";
import AppSideBar from "../../components/app-sidebar";
import ThemeSwitch from "../../components/theme";
import { Separator } from "../../components/ui/separator";

export const metadata: Metadata = {
  title: "DocX | Dashboard",
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
      <main className="flex-1 max-h-screen overflow-hidden">
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger />
          <ThemeSwitch />
        </div>
        <Separator className="my--2"/>
        <div className="">{children}</div>
      </main>
    </SidebarProvider>
  );
}
