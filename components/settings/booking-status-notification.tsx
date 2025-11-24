"use client";

import { updateNotificationSetting } from "@/app/(protected)/settings/actions";
import { AccountProfile } from "@/app/(protected)/settings/types";
import NotificationSection from "@/components/settings/notification-section";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface BookingStatusNotificationProps {
  defaultValues: AccountProfile;
}

const BookingStatusNotification = ({
  defaultValues,
}: BookingStatusNotificationProps) => {
  const [isPending, startTransition] = useTransition();
  // Get email notification settings
  const emailNotifications =
    defaultValues.notification_settings?.filter(
      (setting) => setting.channel === "email",
    ) || [];

  // Check if email has "all" type enabled
  const emailAllSetting = emailNotifications.find((n) => n.type === "all");
  const isEmailAllEnabled = emailAllSetting?.is_enable || false;

  // Initialize state for email notifications
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    emailNotifications.some((n) => n.is_enable),
  );

  const [confirmedBooking, setConfirmedBooking] = useState<boolean>(
    emailNotifications.find((n) => n.type === "confirmed_booking")?.is_enable ||
      isEmailAllEnabled,
  );

  const [rejectedBooking, setRejectedBooking] = useState<boolean>(
    emailNotifications.find((n) => n.type === "rejected_booking")?.is_enable ||
      isEmailAllEnabled,
  );

  // Get web app notification settings
  const webNotifications =
    defaultValues.notification_settings?.filter(
      (setting) => setting.channel === "web",
    ) || [];

  // Check if web has "all" type enabled
  const webAllSetting = webNotifications.find((n) => n.type === "all");
  const isWebAllEnabled = webAllSetting?.is_enable || false;

  const [webAppEnabled, setWebAppEnabled] = useState<boolean>(
    webNotifications.some((n) => n.is_enable),
  );

  const [webConfirmedBooking, setWebConfirmedBooking] = useState<boolean>(
    webNotifications.find((n) => n.type === "confirmed_booking")?.is_enable ||
      isWebAllEnabled,
  );

  const [webRejectedBooking, setWebRejectedBooking] = useState<boolean>(
    webNotifications.find((n) => n.type === "rejected_booking")?.is_enable ||
      isWebAllEnabled,
  );

  // Handle "All" checkbox for email notifications
  const [allEmailChecked, setAllEmailChecked] = useState<boolean>(
    isEmailAllEnabled || (confirmedBooking && rejectedBooking),
  );

  // Handle "All" checkbox for web app notifications
  const [allWebChecked, setAllWebChecked] = useState<boolean>(
    isWebAllEnabled || (webConfirmedBooking && webRejectedBooking),
  );

  useEffect(() => {
    setAllEmailChecked(confirmedBooking && rejectedBooking);
  }, [confirmedBooking, rejectedBooking]);

  useEffect(() => {
    setAllWebChecked(webConfirmedBooking && webRejectedBooking);
  }, [webConfirmedBooking, webRejectedBooking]);

  // Helper function to update notification setting
  const handleUpdateNotification = async (
    channel: string,
    type: string,
    isEnable: boolean,
  ) => {
    startTransition(async () => {
      try {
        const result = await updateNotificationSetting({
          channel,
          type,
          isEnable,
        });

        if (!result.success) {
          toast.error(
            result.message || "Failed to update notification setting",
          );
        } else {
          toast.success(
            result.message || "Notification setting updated successfully",
          );
        }
      } catch (error) {
        toast.error("An error occurred while updating notification setting");
        console.error("Error updating notification:", error);
      }
    });
  };

  // Email notification handlers
  const handleEmailEnabledChange = (enabled: boolean) => {
    setEmailEnabled(enabled);
    // When toggling the main switch, update the "all" type
    handleUpdateNotification("email", "all", enabled);
  };

  const handleConfirmedBookingChange = (checked: boolean) => {
    setConfirmedBooking(checked);

    if (!checked) {
      // When unchecking, check if there are any remaining checked items
      if (rejectedBooking) {
        // Send update for the remaining checked item
        handleUpdateNotification("email", "rejected_booking", true);
      } else {
        // No items remain checked, disable the entire channel
        handleUpdateNotification("email", "all", false);
      }
    } else {
      // When checking, send update for this specific notification type
      handleUpdateNotification("email", "confirmed_booking", true);
    }
  };

  const handleRejectedBookingChange = (checked: boolean) => {
    setRejectedBooking(checked);

    if (!checked) {
      // When unchecking, check if there are any remaining checked items
      if (confirmedBooking) {
        // Send update for the remaining checked item
        handleUpdateNotification("email", "confirmed_booking", true);
      } else {
        // No items remain checked, disable the entire channel
        handleUpdateNotification("email", "all", false);
      }
    } else {
      // When checking, send update for this specific notification type
      handleUpdateNotification("email", "rejected_booking", true);
    }
  };

  const handleAllEmailChange = (checked: boolean) => {
    setAllEmailChecked(checked);
    setConfirmedBooking(checked);
    setRejectedBooking(checked);
    // When toggling "All" checkbox, update the "all" type
    handleUpdateNotification("email", "all", checked);
  };

  // Web app notification handlers
  const handleWebAppEnabledChange = (enabled: boolean) => {
    setWebAppEnabled(enabled);
    // When toggling the main switch, update the "all" type
    handleUpdateNotification("web", "all", enabled);
  };

  const handleWebConfirmedBookingChange = (checked: boolean) => {
    setWebConfirmedBooking(checked);

    if (!checked) {
      // When unchecking, check if there are any remaining checked items
      if (webRejectedBooking) {
        // Send update for the remaining checked item
        handleUpdateNotification("web", "rejected_booking", true);
      } else {
        // No items remain checked, disable the entire channel
        handleUpdateNotification("web", "all", false);
      }
    } else {
      // When checking, send update for this specific notification type
      handleUpdateNotification("web", "confirmed_booking", true);
    }
  };

  const handleWebRejectedBookingChange = (checked: boolean) => {
    setWebRejectedBooking(checked);

    if (!checked) {
      // When unchecking, check if there are any remaining checked items
      if (webConfirmedBooking) {
        // Send update for the remaining checked item
        handleUpdateNotification("web", "confirmed_booking", true);
      } else {
        // No items remain checked, disable the entire channel
        handleUpdateNotification("web", "all", false);
      }
    } else {
      // When checking, send update for this specific notification type
      handleUpdateNotification("web", "rejected_booking", true);
    }
  };

  const handleAllWebChange = (checked: boolean) => {
    setAllWebChecked(checked);
    setWebConfirmedBooking(checked);
    setWebRejectedBooking(checked);
    // When toggling "All" checkbox, update the "all" type
    handleUpdateNotification("web", "all", checked);
  };

  // Email notification options
  const emailOptions = [
    {
      id: "confirmed-booking",
      label: "Confirmed Booking",
      checked: confirmedBooking,
      onCheckedChange: handleConfirmedBookingChange,
    },
    {
      id: "rejected-booking",
      label: "Rejected Booking",
      checked: rejectedBooking,
      onCheckedChange: handleRejectedBookingChange,
    },
  ];

  // Web app notification options
  const webOptions = [
    {
      id: "web-confirmed-booking",
      label: "Confirmed Booking",
      checked: webConfirmedBooking,
      onCheckedChange: handleWebConfirmedBookingChange,
    },
    {
      id: "web-rejected-booking",
      label: "Rejected Booking",
      checked: webRejectedBooking,
      onCheckedChange: handleWebRejectedBookingChange,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Email Notifications */}
      <NotificationSection
        title="Email Notifications"
        enabled={emailEnabled}
        onEnabledChange={handleEmailEnabledChange}
        options={emailOptions}
        showAllCheckbox
        allChecked={allEmailChecked}
        onAllCheckedChange={handleAllEmailChange}
      />

      {/* Web App Notifications */}
      <NotificationSection
        title="Web App Notifications"
        enabled={webAppEnabled}
        onEnabledChange={handleWebAppEnabledChange}
        options={webOptions}
        showAllCheckbox
        allChecked={allWebChecked}
        onAllCheckedChange={handleAllWebChange}
      />
    </div>
  );
};

export default BookingStatusNotification;
