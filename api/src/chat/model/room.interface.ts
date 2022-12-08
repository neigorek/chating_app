import { UserInterface } from 'src/user/model/user.interface';

export interface RoomInterface {
  id?: number;
  name?: string;
  description?: string;
  users?: UserInterface[];
  created_at?: Date;
  updated_at?: Date;
}
