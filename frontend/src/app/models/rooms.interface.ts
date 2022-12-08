import { UserInterface } from './user.interface';
import { MetaInterface } from './meta.interface';

export interface RoomInterface {
  id?: number;
  name?: string;
  description?: string;
  users?: UserInterface[];
  created_at?: Date;
  updated_at?: Date;
}

export interface RoomPaginationInterface {
  items: RoomInterface[];
  meta: MetaInterface;
}
