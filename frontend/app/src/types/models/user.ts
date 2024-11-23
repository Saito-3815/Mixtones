import { Community } from './community';
import { Tune } from './tune';

export interface User {
  id: number;
  name: string;
  avatar: string;
  check_tunes: Pick<Tune, 'id'>[];
  communities: Pick<Community, 'id'>[];
  created_at: string;
  introduction: string | null;
  last_active_at: string;
  like_tunes: Pick<Tune, 'id'>[];
  spotify_id: boolean;
  updated_at: string;
}

