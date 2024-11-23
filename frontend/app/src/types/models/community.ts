import { User } from './user';

export interface Community {
  id: number;
  name: string;
  introduction?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  playlist_name: string;
  playlist_tunes_count: number;
  members: User[];
}