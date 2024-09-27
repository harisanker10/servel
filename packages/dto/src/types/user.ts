export interface User {
  email: string;
  id: string;
  avatar?: string | undefined;
  fullname?: string | undefined;
  authType: string[];
}
