"use client";

import { changeLanguage } from "@/app/(protected)/settings/actions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { CertificateUploader } from "./certificate-uploader";
import { NameCardUploader } from "./name-card-uploader";

interface AdditionalSettingsSectionProps {
  defaultLanguage?: string;
  certificateUrl?: string | null;
  nameCardUrl?: string | null;
}

const AdditionalSettingsSection = ({
  defaultLanguage = "english",
  certificateUrl,
  nameCardUrl,
}: AdditionalSettingsSectionProps) => {
  const [language, setLanguage] = useState(defaultLanguage);

  return (
    <div className="space-y-6">
      {/* Language Setting */}
      <div>
        <Label className="text-sm font-medium">Language Setting</Label>
        <ChangeLanguageSelect
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>

      {/* Certificate Upload */}
      <div>
        <Label className="text-sm font-medium">Certificate</Label>
        <CertificateUploader certificateUrl={certificateUrl} />
      </div>

      {/* Name Card Upload */}
      <div>
        <Label className="text-sm font-medium">Name Card</Label>
        <NameCardUploader nameCardUrl={nameCardUrl} />
      </div>
    </div>
  );
};

// Separate component for language selection
const ChangeLanguageSelect = ({
  language,
  onLanguageChange,
}: {
  language: string;
  onLanguageChange: (lang: string) => void;
}) => {
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  const handleLanguageChange = async (newLanguage: string) => {
    setIsLanguageLoading(true);
    try {
      const result = await changeLanguage({ language: newLanguage });
      if (result.success) {
        onLanguageChange(newLanguage);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to change language");
    } finally {
      setIsLanguageLoading(false);
    }
  };

  return (
    <Select
      value={language}
      onValueChange={handleLanguageChange}
      disabled={isLanguageLoading}
    >
      <SelectTrigger className="mt-2 bg-gray-200">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="english">English</SelectItem>
        <SelectItem value="indonesian">Indonesian</SelectItem>
        <SelectItem value="korean">Korean</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AdditionalSettingsSection;
