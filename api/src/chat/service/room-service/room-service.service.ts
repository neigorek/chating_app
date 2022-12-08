import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/chat/model/room.entity';
import { Repository } from 'typeorm';
import { RoomInterface } from 'src/chat/model/room.interface';
import { UserInterface } from 'src/user/model/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(
    room: RoomInterface,
    creator: UserInterface,
  ): Promise<RoomInterface> {
    const newRoom: RoomInterface = await this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async getRoomsForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<RoomInterface>> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where(`user.id = :userId`, { userId });
    return paginate(query, options);
  }

  async addCreatorToRoom(
    room: RoomInterface,
    creator: UserInterface,
  ): Promise<any> {
    room.users.push(creator);
    return room;
  }
}
