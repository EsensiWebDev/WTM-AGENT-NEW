"use client";

import { fetchAccountProfile } from "@/app/(protected)/settings/fetch";
import { useAuth } from "@/context/AuthContext";
import { formatUrl } from "@/lib/url-utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";

export const NavUser = () => {
  const [isPending, startTransition] = React.useTransition();
  const { accessToken, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAuthenticated = !!accessToken;

  const {
    data: dataProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchAccountProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: isAuthenticated,
  });

  const user = {
    name: dataProfile?.data.full_name || "User",
    email: dataProfile?.data.email || "",
    avatar: formatUrl(dataProfile?.data.photo_profile) || "",
  };

  const handleLogout = async (
    event: React.MouseEvent | React.KeyboardEvent,
  ) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await logout();
        queryClient.clear();
        toast.success("Logout successfully");
      } catch (error) {
        console.error("Logout error", error);
        toast.error("Something went wrong while logging out");
      } finally {
        router.push("/login");
      }
    });
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (isLoadingProfile) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />;
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={handleSignIn} variant={"ghost"}>
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={""} alt={"Not logged In"} />
          <AvatarFallback className="rounded-lg"></AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">Sign in</span>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"lg"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-primary rounded-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-30 rounded-lg">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/settings"}>
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          {isPending ? <Spinner /> : <LogOut className="size-4" />}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
