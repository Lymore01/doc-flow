"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Image from "next/image";
import { useIsMobile } from "../hooks/useMobile";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}

const USER_PROFILE_ITEMS = [
  {
    title: "Account",
    url: "/account",
    icon: <BadgeCheck />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <Bell />,
  },
  {
    title: "Sign Out",
    url: "/logout",
    icon: <LogOut />,
  },
];

export default function AppSideBar({ items }: { items: SidebarItem[] }) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { state } = useSidebar();

  const getLogoSrc = () => {
    const basePath =
      isMobile || state === "collapsed"
        ? "/images/mobile/logo"
        : "/images/docX-logo";
    return theme === "light"
      ? `${basePath}-black.png`
      : `${basePath}-white.png`;
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-start justify-center">
        <Link href="/">
          <Image
            src={getLogoSrc()}
            alt="docX"
            width={120}
            height={40}
            className="w-[90px] h-[60px] md:size-auto"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto">
                  <div className="size-9 rounded-lg cursor-pointer">
                    <Image
                      src={"/images/profile.jpg"}
                      alt="profile image"
                      width={120}
                      height={40}
                      className="w-[90px] h-[60px] lg:size-full rounded-lg object-cover object-center"
                    />
                  </div>

                  {state !== "collapsed" && (
                    // !fix: make sure the image is collapsed properly
                    <>
                      <div className="text-base">
                        <h1>Kelly Limo</h1>
                        <p className="text-xs">kelly@gmail.com</p>
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {USER_PROFILE_ITEMS.map((item) => (
                  <DropdownMenuItem key={item.title}>
                    <Link href={item.url} className="flex gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
