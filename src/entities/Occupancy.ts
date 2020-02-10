export interface IOccupancy {
  roomId: number;
  lectureId: number;
  start: Date;
  end: Date;
  day: string;
  rrule: string;
}

export class Occupancy implements IOccupancy {
  roomId: number;
  lectureId: number;
  start: Date;
  end: Date;
  day: string;
  rrule: string;
  constructor(roomID?: number, lecturesID?: number, start?: Date, end?: Date, day?: string, rrule?: string) {
    this.roomId = roomID || 0;
    this.lectureId = lecturesID || 0;
    this.start = new Date();
    if (start) {
    this.start = new Date(start.getTime()) || new Date();
    }
    this.end = new Date();
    if (end) {
      this.end = new Date(end.getTime()) || new Date();
      }
    this.day = day || '';
    this.rrule = rrule || '';
  }
}
