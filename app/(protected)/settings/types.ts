export interface AccountProfile {
  agent_company: string;
  certificate: string;
  email: string;
  full_name: string;
  id: number;
  kakao_talk_id: string;
  name_card: string;
  notification_settings: [
    {
      channel: string;
      is_enable: boolean;
      type: string;
    },
  ];
  password: string;
  phone: string;
  photo_profile: string;
  status: string;
  username: string;
  currency?: string;
}

export interface AccountSettingResponse {
  success: boolean;
  message: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountSettingResponse {
  success: boolean;
  message: string;
}

export interface LanguageChange {
  language: string;
}

export interface FileUpload {
  file: File;
  type: "certificate" | "nameCard";
}
