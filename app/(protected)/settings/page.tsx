import AccountSettingForm from "@/components/settings/account-setting-form";
import AdditionalSettingsSection from "@/components/settings/additional-settings-section";
import EditProfileForm from "@/components/settings/edit-profile-form";
import { ProfilePhotoUploader } from "@/components/settings/profile-photo-uploader";
import { fetchAccountProfile } from "./fetch";

const AccountSettingPage = async () => {
  const { data: accountProfile } = await fetchAccountProfile();

  console.log({ accountProfile });

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
            photoUrl={
              accountProfile.photo_profile
                ? `http://${accountProfile.photo_profile}`
                : null
            }
            fullName={accountProfile.full_name}
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
            certificateUrl={
              accountProfile.certificate ? accountProfile.certificate : null
            }
            nameCardUrl={
              accountProfile.name_card
                ? `http://${accountProfile.name_card}`
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingPage;
