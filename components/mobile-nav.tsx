/* eslint-disable @typescript-eslint/no-explicit-any */
import ThemeSwitch from "./theme";
import Regbutton from "./reg-button";
import { SVGProps } from "react";
import NavMorph from "./nav-morph";
import {
  NAV_ITEMS,
  FEATURES,
  INTEGRATIONS,
  PRODUCTS,
  SOLUTIONS,
} from "../lib/constants";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetFooter,
} from "../components/ui/sheet";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ChevronRight, X } from "lucide-react";
import Image from "next/image";

export default function MobileNav({
  src,
  setActiveItem,
}: {
  src: () => string;
  setActiveItem: (arg: any) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-4">
        <div className="flex items-center justify-between">
          <Image
            src={src()}
            alt="docX"
            width={120}
            height={40}
            className="w-[90px] h-[60px] lg:size-full"
          />
          <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
        <div className="grid gap-6 md:gap-2 py-6">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex w-full items-center py-2 text-base justify-between divide-y-2 border border-t-0 border-l-0 border-r-0 border-b-slate-100">
                    {item.label}
                    <ChevronRight />
                  </div>
                </SheetTrigger>
                <SheetContent side="right" className="p-4">
                  <SheetClose className="mb-4  ">
                    <span className="flex gap-2 items-center">
                      <ArrowLeftIcon size={18} /> back
                    </span>
                    <span className="sr-only">back</span>
                  </SheetClose>
                  <h1 className="font-semibold text-xl mb-4">{item.label}</h1>
                  <NavMorph
                    items={
                      item.label === "Solutions"
                        ? SOLUTIONS
                        : item.label === "Products"
                        ? PRODUCTS
                        : item.label === "Features"
                        ? FEATURES
                        : item.label === "Integrations"
                        ? INTEGRATIONS
                        : []
                    }
                    navH={8}
                    setActiveItem={setActiveItem}
                    label={item.label}
                  />
                </SheetContent>
              </Sheet>
            </div>
          ))}
        </div>
        <SheetFooter>
          <div className="flex flex-col gap-4 w-full">
            <ThemeSwitch />
            <Regbutton type="Login" variant="outline" />
            <Regbutton
              type="Sign Up"
              classname="bg-primary dark:bg-background-light dark:text-primary"
            />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
