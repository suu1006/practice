export type AuthUser = {
  id: number;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type AuthRequest = {
  email: string;
  password: string;
};

export type MessageResponse = {
  message: string;
};
