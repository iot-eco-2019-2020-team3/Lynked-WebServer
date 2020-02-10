export interface IParticipants {
  userID: number;
  lecturesID: number;
}

export class Participants implements IParticipants {
  userID: number;
  lecturesID: number;

  constructor(userID?: number, lecturesID?: number) {
    this.userID = userID || 0;
    this.lecturesID = lecturesID || 0;
  }
}
