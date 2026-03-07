import { HTTPTransport } from '../http/HttpTransport';
import { BASE_URL } from '../http/config';

export interface ProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface AvatarResponse {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface ProfilePassword {
  oldPassword: string;
  newPassword: string;
}

class ProfileAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport(BASE_URL);
  }

  updateData(data: ProfileData): Promise<ProfileData> {
    return this.http.put<ProfileData>('user/profile', { data });
  }

  updateAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.put<AvatarResponse>('user/profile/avatar', { data: formData });
  }

  updatePassword(password: ProfilePassword): Promise<ProfilePassword> {
    return this.http.put<ProfilePassword>('user/password', { data: password });
  }
}

export const profileAPI = new ProfileAPI();
