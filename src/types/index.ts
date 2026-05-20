export interface Session {
  id: string;
  title: string;
  description: string;
  room: string;
  timeslot: string;
  capacity: number;
  registeredUsers: string[];
  waitlist: string[];
}

export type Role = 'user' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  role: Role;
}
