export interface UserMemberType {
  id: number;
  username: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
}

export interface UserMembersType {
  manager: UserMemberType | null;
  members: UserMemberType[];
}
