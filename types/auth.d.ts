export interface AuthResponse {
  accessToken: string;
  userInfo: UserInfo;
}
export interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface RegisterType {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface InfoExtractToken {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
  iat: number;
}
