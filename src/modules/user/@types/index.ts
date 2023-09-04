export interface User {
  rt: string;
  username: string;
  password: string;
  email: string;
  confirmed: boolean;
  confirmAttempts: number;
  avatarPath: string;
  codes: Object;
  data: Object;
  role: UserRole;
}

export interface PasswordResetRequest extends Request {
  email: string;
}

export interface JWTAuthGuardRequest extends Request {
  user: { id: string };
}

export interface JWTDecodedObject {
  sub: string;
  name: string;
  iat: number;
  exp: number;
}

export enum PossibleUserSearchProperty {
  email = 'email',
  password = 'password',
  username = 'useraname',
  id = '_id',
}

export enum UserRole {
  common = 'user',
  admin = 'admin',
  superAdmin = 'super-admin',
}

export type UserFixture = Omit<User, 'password'>;

export enum CodeTypes {
  resetPassword = 'reset-password',
}
