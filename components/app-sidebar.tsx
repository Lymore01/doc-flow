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
import { SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}

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
            <SidebarMenuButton className="h-auto">
              <SignedIn>
                <UserButton
                  appearance={{
                    baseTheme: theme === "dark" ? dark : undefined,
                    elements: {
                      userButtonPopoverCard: {
                        pointerEvents: "initial",
                      },
                    },
                  }}
                />
              </SignedIn>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
