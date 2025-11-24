import AccountSettingForm from "@/components/settings/account-setting-form";
import AdditionalSettingsSection from "@/components/settings/additional-settings-section";
import BookingStatusNotification from "@/components/settings/booking-status-notification";
import EditProfileForm from "@/components/settings/edit-profile-form";
import { ProfilePhotoUploader } from "@/components/settings/profile-photo-uploader";
import { formatUrl } from "@/lib/url-utils";
import { fetchAccountProfile } from "./fetch";

const AccountSettingPage = async () => {
  const { data: accountProfile } = await fetchAccountProfile();

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Setting</h1>
      </div>

      {/* Account Setting Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <h2 className="font-medium">Account Setting</h2>
        </div>
        <div className="col-span-6">
          <AccountSettingForm defaultValues={accountProfile} />
        </div>
        <div className="col-span-4">
          <div className="mb-2 font-medium">Profile photo</div>

          <ProfilePhotoUploader
            photoUrl={formatUrl(accountProfile?.photo_profile)}
            fullName={accountProfile?.full_name}
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8" />

      {/* Edit Profile Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <h2 className="font-medium">Edit Profile</h2>
        </div>

        <div className="col-span-6">
          <EditProfileForm defaultValues={accountProfile} />
        </div>

        <div className="col-span-4">
          <AdditionalSettingsSection
            certificateUrl={formatUrl(accountProfile?.certificate)}
            nameCardUrl={formatUrl(accountProfile?.name_card)}
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8" />

      {/* Booking Status Notification Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <h2 className="font-medium">Booking Status Notification</h2>
        </div>

        <div className="col-span-6">
          <BookingStatusNotification defaultValues={accountProfile} />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingPage;
