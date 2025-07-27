"use client";

import Link from "next/link";
import { Logo } from "../logo";

export const Footer = () => {
  return (
    <footer>
      <nav className="fixed bottom-0 z-20 w-full border-t bg-[#2D2E33] py-2 text-white backdrop-blur-3xl">
        <div className="mx-auto max-w-7xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Left side - Logo */}
            <div className="flex w-full items-center justify-start lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>
            </div>

            {/* Right side - Copyright text */}
            <div className="flex w-full items-center justify-end lg:w-auto">
              <p className="text-white-foreground text-sm">
                ©{new Date().getFullYear()} The Hotel Box. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </nav>
    </footer>
  );
};
