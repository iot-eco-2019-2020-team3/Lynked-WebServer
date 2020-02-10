import { IRoom } from '@entities';
import { pool } from '@dbConnection';

export interface IRoomDao {
  getByBuildingAndRoom: (buildingNr: string, roomNr: string) => Promise<IRoom | null>;
  getAll: () => Promise<IRoom[] | void>;
  add: (Room: IRoom) => Promise<void>;
  update: (Room: IRoom) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class RoomDao implements IRoomDao {
  /**
   * @param buildingNr
   * @param roomNr
   */
  public async getByBuildingAndRoom(buildingNr: string, roomNr: string): Promise<IRoom | null> {
    const res = await pool<IRoom>('rooms')
      .select()
      .where({
        roomNr: roomNr,
        buildingNr: buildingNr
      })
      .then(resp => {
        let res = resp[0];
        return res;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    return res;
  }


  /**
   *
   */
  public async getAll(): Promise<IRoom[] | void> {
    try {
      const res = await pool<IRoom>('rooms')
        .select()
        .then(resp => {
          return resp;
        })
        .catch(err => {
          console.log(err);
        });
      return res;
    } catch (error) {
      throw error;
    }
  }


  /**
   *
   * @param Room
   */
  public async add(room: IRoom): Promise<void> {
    try {
      pool<IRoom>('rooms')
        .insert({
          roomNr: room.roomNr,
          buildingNr: room.buildingNr,
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  }



  /**
   *
   * @param Room
   */
  public async update(room: IRoom): Promise<void> {
    try {
      pool<IRoom>('rooms')
        .where({
          id: room.id
        })
        .update({
          roomNr: room.roomNr,
          buildingNr: room.buildingNr,
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  }


  /**
   *
   * @param id
   */
  public async delete (id: number): Promise < void> {
  try {
    pool<IRoom>('rooms')
        .where({
      id: id
    })
      .del()
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  } catch(error) {
    throw error;
  }
}
}
