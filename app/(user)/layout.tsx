import { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { BarChart, Folder, Home, Link } from "lucide-react";
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
            url: "/dashboard/documents",
            icon: <Folder />,
          },
          {
            title: "My Links",
            url: "/dashboard/links",
            icon: <Link />,
          },
          {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: <BarChart />,
          }
        ]}
      />
      <div className="flex flex-col flex-1 h-screen">
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger />
          <ThemeSwitch />
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto md:overflow-hidden">{children}</div>
      </div>
    </SidebarProvider>
  );
}
