export interface Message {
  _id: string;
  conversation: string;
  type: string;
  content: string;
  sender: Sender;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface Sender {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}
