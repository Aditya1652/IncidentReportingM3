export interface User {
  id?: string;
  name?: string;
  email: string;
  role?: 'admin' | 'reporter';
  token?: string;
  expirationDate?: Date;
}
