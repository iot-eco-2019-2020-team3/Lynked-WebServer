export interface ISlackInfo {
  id?: number;
  teamId: string;
  channelId: string;
}

export class SlackInfo implements ISlackInfo {
  id?: number;
  teamId: string;
  channelId: string;

  constructor(teamID?: string, channelID?: string) {
    this.teamId = teamID || '';
    this.channelId = channelID || '';
  }
}
