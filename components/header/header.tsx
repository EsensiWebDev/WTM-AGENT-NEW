"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";
import { Logo } from "../logo";
import { CartButton } from "./cart-button";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileMenu } from "./mobile-menu";
import { NavUser } from "./nav-user";
import { NotificationButton } from "./notification-button";

const menuItems = [
  {
    name: "Home",
    href: "/home",
    isPublic: true,
  },
  {
    name: "History Booking",
    href: "/history-booking",
    isPublic: false,
  },
  {
    name: "Contact Us",
    href: "/contact-us",
    isPublic: false,
  },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const { accessToken } = useAuth();

  const isAuthenticated = !!accessToken;

  // Filter menu items based on authentication status
  const filteredMenuItems = menuItems.filter(
    (item) => item.isPublic || isAuthenticated,
  );

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-primary fixed z-20 w-full border-b text-white backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-7xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Left side - Navigation Menu */}
            <DesktopNavigation filteredMenuItems={filteredMenuItems} />

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
              <MobileMenu
                menuState={menuState}
                setMenuState={setMenuState}
                filteredMenuItems={filteredMenuItems}
              />

              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <CartButton />
                    <NotificationButton />
                    <NavUser />
                  </>
                ) : (
                  <>
                    <NavUser />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
