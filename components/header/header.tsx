"use client";

import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Logo } from "../logo";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { NavUser } from "./nav-user";

const menuItems = [
  {
    name: "Home",
    href: "/home",
  },
  {
    name: "History Booking",
    href: "/history-booking",
  },
];

const user = {
  name: "Riza Kurniawanda",
  email: "riza@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const cartItemCount = 3; // Static cart items count

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-primary fixed z-20 w-full border-b text-white backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-7xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Left side - Navigation Menu */}
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block font-semibold duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Center - Logo */}
            <div className="flex w-full items-center justify-center lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>
            </div>

            {/* Right side - Mobile menu button and user controls */}
            <div className="flex w-full items-center justify-end gap-6 lg:w-auto">
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
              </button>

              <div className="flex items-center gap-3">
                <Link href={"/cart"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-10"
                  >
                    <ShoppingCart className="size-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs font-medium"
                    >
                      {cartItemCount}
                    </Badge>
                  </Button>
                </Link>
                <NavUser user={user} />
              </div>
            </div>

            {/* Menu Mobile  */}
            <div className="bg-background mb-6 hidden w-full rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block lg:hidden dark:shadow-none">
              <div className="flex flex-col items-center space-y-6">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
