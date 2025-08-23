import AccountSettingForm from "@/components/settings/account-setting-form";
import EditProfileForm from "@/components/settings/edit-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { fetchAccountProfile } from "./fetch";

const AccountSettingPage = async () => {
  const accountProfile = await fetchAccountProfile();

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
          {/* Profile Photo Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Profile photo</Label>
            <div className="relative inline-block">
              <Avatar className="h-36 w-36 rounded-lg">
                <AvatarImage src={accountProfile.profileImage} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {accountProfile.firstName?.[0]}
                  {accountProfile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -right-4 -bottom-4 h-10 w-10 rounded-full bg-[#2d3e3f] text-white shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16.474 5.341a2.5 2.5 0 1 1 3.536 3.535M3 17.25V21h3.75l10.607-10.607a2.5 2.5 0 0 0-3.535-3.535L3 17.25Z"
                  />
                </svg>
              </Button>
            </div>
          </div>
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
          <div className="space-y-6">
            {/* Language Setting */}
            <div>
              <Label className="text-sm font-medium">Language Setting</Label>
              <Select defaultValue="english">
                <SelectTrigger className="mt-2 bg-gray-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="indonesian">Indonesian</SelectItem>
                  <SelectItem value="korean">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certificate Upload */}
            <div>
              <Label className="text-sm font-medium">Certificate</Label>
              <Card className="mt-2 border-2 border-dashed border-gray-300">
                <CardContent className="flex h-32 items-center justify-center">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Name Card Upload */}
            <div>
              <Label className="text-sm font-medium">Name Card</Label>
              <Card className="mt-2 border-2 border-dashed border-gray-300">
                <CardContent className="flex h-32 items-center justify-center">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Name Card
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingPage;
