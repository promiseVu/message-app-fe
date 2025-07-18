export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  isVerified: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  friends?: User[];
  pendingRequest?: User[];
  sentRequests?: User[];
}
