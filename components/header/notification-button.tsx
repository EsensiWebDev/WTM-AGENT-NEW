"use client";

import {
  fetchNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
  Notification,
} from "@/server/header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface NotificationButtonProps {}

export function NotificationButton({}: NotificationButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: notificationData,
    isLoading: isLoadingNotification,
    isError: isErrorNotification,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Calculate unread count from fetched notification data
  const unreadCount =
    notificationData?.data.filter((n) => !n.is_read).length || 0;

  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationAsRead({ notif_id: notification.id });
    queryClient.invalidateQueries({ queryKey: ["notification"] });
    router.push(notification.redirect_url);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationAsRead();
    queryClient.invalidateQueries({ queryKey: ["notification"] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10"
          disabled={isLoadingNotification}
        >
          {isLoadingNotification ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent sm:h-5 sm:w-5" />
          ) : (
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          {unreadCount > 0 &&
            !isLoadingNotification &&
            !isErrorNotification && (
              <Badge
                variant="destructive"
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[10px] font-medium sm:-top-1 sm:-right-1 sm:h-5 sm:w-5 sm:text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          {isErrorNotification && !isLoadingNotification && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[10px] font-medium sm:-top-1 sm:-right-1 sm:h-5 sm:w-5 sm:text-xs"
            >
              !
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900">Notification</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoadingNotification ? (
            <div className="p-4 text-center">
              <p>Loading notifications...</p>
            </div>
          ) : isErrorNotification ? (
            <div className="p-4 text-center">
              <p className="text-destructive">Error loading notifications</p>
            </div>
          ) : notificationData?.data.length === 0 ? (
            <div className="p-4 text-center">
              <p>No notifications</p>
            </div>
          ) : (
            notificationData?.data.map((notification) => (
              <div
                key={notification.id}
                className="flex cursor-pointer items-start gap-3 border-b p-4 transition-colors last:border-b-0 hover:bg-gray-50"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 capitalize">
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {unreadCount > 0 && !isLoadingNotification && !isErrorNotification && (
          <div className="border-t p-4">
            <Button
              onClick={handleMarkAllAsRead}
              className="w-full bg-gray-800 text-white hover:bg-gray-700"
            >
              Mark All As Read
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
