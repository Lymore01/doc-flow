"use client";
import Image from "next/image";
import Link from "next/link";
import blackLogo from "../public/images/docX-logo-black.png";
import whiteLogo from "../public/images/docX-logo-white.png";
import { useTheme } from "next-themes";
import ThemeSwitch from "./theme";
import Regbutton from "./reg-button";
import { useRef, useState } from "react";
import NavMorph from "./nav-morph";
import useNavHeight from "../hooks/useNavHeight";
import {
  NAV_ITEMS,
  FEATURES,
  INTEGRATIONS,
  PRODUCTS,
  SOLUTIONS,
} from "../lib/constants";
import MobileNav from "./mobile-nav";
export default function NavBar() {
  const navRef = useRef<HTMLElement | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navHeight = useNavHeight(navRef);

  const { theme } = useTheme();

  const getLogoSrc = () => {
    return theme === "dark" || theme === "system" ? whiteLogo.src : blackLogo.src;
  };

  return (
    <header
      className="flex justify-between w-full items-center p-4 "
      ref={navRef}
    >
      <Link href="/">
        <Image
          src={getLogoSrc()}
          alt="docX"
          width={120}
          height={40}
          priority
          loading="eager"
          className="w-[90px] h-[60px] md:size-auto"
        />
      </Link>
      <nav className="hidden lg:flex gap-6 mx-auto">
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="relative">
            {" "}
            <Link
              href={item.href}
              className="group inline-flex h-9 items-center justify-center px-4 py-2 text-base font-medium transition-colors hover:text-primary dark:hover:text-gray-50"
              prefetch={false}
              onMouseEnter={() => setActiveItem(item.label)}
            >
              {item.label}
            </Link>
            {activeItem === item.label && (
              <div className="absolute left-0 top-full mt-2 z-50">
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
                  navH={navHeight / 4}
                  setActiveItem={setActiveItem}
                  label={item.label}
                />
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="gap-2 hidden md:flex">
        <ThemeSwitch />
        <Regbutton type="Login" variant="outline" />
        <Regbutton
          type="Signup"
          classname="bg-primary dark:bg-background-light dark:text-primary"
        />
      </div>

      <MobileNav src={getLogoSrc} setActiveItem={setActiveItem} />
    </header>
  );
}
