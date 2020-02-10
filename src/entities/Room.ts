import { IOrganization } from './Organization';

export interface IRoom {
  id?: number;
  buildingNr: string;
  roomNr: string;
}

export class Room implements IRoom {
  id?: number;
  buildingNr: string;
  roomNr: string;

  constructor(buildingNr?: string, roomNr?: string) {
    this.roomNr = roomNr || ' ';
    this.buildingNr = buildingNr || ' ';
  }
}
