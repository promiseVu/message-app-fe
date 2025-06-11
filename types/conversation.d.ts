import type { User } from "~/types/user";
export interface Conversation {
  _id: string;
  isGroup: boolean;
  members: Member[];
  createdAt: string;
  updatedAt: string;
  lastMessage: Message;
}

export interface Member {
  joinedAt: string;
  user: User;
}
