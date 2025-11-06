"use client";

import { Bell, Check, Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Logo } from "../logo";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

// Mock notification data
const notifications = [
  {
    id: 1,
    title: "Booking Status Rejected",
    message: "Booking was rejected due to payment issues",
    booking_id: "BK-001",
    isRead: false,
    type: "error",
  },
  {
    id: 2,
    title: "Booking Status Approved",
    message: "Booking was approved",
    booking_id: "BK-001",
    isRead: true,
    type: "success",
  },
  {
    id: 3,
    title: "Booking Status Approved",
    message: "Booking was approved",
    booking_id: "BK-001",
    isRead: true,
    type: "success",
  },
  {
    id: 4,
    title: "Booking Status Approved",
    message: "Booking was approved",
    booking_id: "BK-001",
    isRead: true,
    type: "success",
  },
];

export const Header = () => {
  const router = useRouter();
  const [menuState, setMenuState] = React.useState(false);
  const [notificationList, setNotificationList] = React.useState(notifications);
  const cartItemCount = 3; // Static cart items count

  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  const unreadCount = notificationList.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotificationList((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  const handleNotificationClick = (bookingId: string) => {
    router.push(`/history-booking?search=${encodeURIComponent(bookingId)}`);
  };

  const handleSignIn = () => {
    router.push("/login");
  };

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
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {filteredMenuItems.map((item, index) => {
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
                {isAuthenticated ? (
                  <>
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

                    {/* Notification Popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative size-10"
                        >
                          <Bell className="size-5" />
                          {unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs font-medium"
                            >
                              {unreadCount}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="border-b p-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Notification
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notificationList.map((notification) => (
                            <div
                              key={notification.id}
                              className="flex cursor-pointer items-start gap-3 border-b p-4 transition-colors last:border-b-0 hover:bg-gray-50"
                              onClick={() =>
                                handleNotificationClick(notification.booking_id)
                              }
                            >
                              <div
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                  notification.type === "error"
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              >
                                {notification.type === "error" ? (
                                  <X className="h-4 w-4 text-white" />
                                ) : (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {unreadCount > 0 && (
                          <div className="border-t p-4">
                            <Button
                              onClick={markAllAsRead}
                              className="w-full bg-gray-800 text-white hover:bg-gray-700"
                            >
                              Mark All As Read
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </>
                ) : (
                  <></>
                )}

                {/* Conditionally render sign-in button or user menu */}
                {isLoading ? (
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />
                ) : session?.user ? (
                  <NavUser
                    user={{
                      name:
                        `${session.user.first_name || ""} ${session.user.last_name || ""}`.trim() ||
                        session.user.username ||
                        "User",
                      email: session.user.email || "",
                      avatar: session.user.photo_url || "/avatars/shadcn.jpg",
                    }}
                  />
                ) : (
                  <Button onClick={handleSignIn} variant={"ghost"}>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={""} alt={"Not logged In"} />
                      <AvatarFallback className="rounded-lg"></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Sign in</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {/* Menu Mobile  */}
            <div className="bg-background mb-6 hidden w-full rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block lg:hidden dark:shadow-none">
              <div className="flex flex-col items-center space-y-6">
                <ul className="space-y-6 text-base">
                  {filteredMenuItems.map((item, index) => {
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
