import { IOccupancy, IRoom, Occupancy, SlackInfo } from '@entities';
import { pool } from '@dbConnection';
import { RRule, RRuleSet, rrulestr } from 'rrule'
import { SlackInfoDao } from '@daos';
import {LectureDao} from './../Lecture/LectureDao';
import Helper from '../../helper/HelperClass';



const LecDao = new LectureDao();
const SlackDao = new SlackInfoDao();
const https = require('https');
interface IChannel {
  topic: string;
  url: string;
}

interface IGetChannelResponse {
  channels: Array<IChannel>
}

class GetChannelResponse implements IGetChannelResponse {
  channels: Array<IChannel> = [];

  constructor() {
    this.channels = new Array<IChannel>();
  }
}

export interface IOccupancyDao {
  getByRoom: (roomId: number) => Promise<IOccupancy[] | null>;
  getById: (id: number) => Promise<IOccupancy[] | null>;
  getByRoomAndTime: (room: IRoom) => Promise<GetChannelResponse | null>;
  getByObject(occ: IOccupancy): Promise<IOccupancy | null | undefined>;
  getAll: () => Promise<IOccupancy[] | void>;
  add: (user: IOccupancy) => Promise<void>;
  update: (user: IOccupancy) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class OccupancyDao implements IOccupancyDao {



  /**
   * @param id
   */
  public async getById(id: number): Promise<IOccupancy[] | null> {
    const res = await pool<IOccupancy>('occupancy')
      .select()
      .where({
        lectureId: id
      })
      .then(resp => {
        return resp;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    return res;
  }



  public async getByRoomAndTime(room: IRoom): Promise<GetChannelResponse | null> {
    var today = new Date();
    today.setHours(9, 0);
    const res = await pool<IOccupancy>('occupancy')
      .select()
      .join('rooms', 'occupancy.roomId', '=', 'rooms.Id')
      .join('lectures', 'occupancy.lectureId', '=', 'lectures.Id')
      .where({
        roomNr: room.roomNr,
        buildingNr: room.buildingNr,
      })
      .where('start', '<', today.toTimeString()).andWhere('end', '>', today.toTimeString())
      .then(async resp => {
        var result = new GetChannelResponse();


        for (const occ of resp) {
          if (occ.rrule) {
            var parsedRrule = rrulestr(occ.rrule);
            var before = new Date(today);
            before.setHours(0);
            before.setMinutes(0);
            before.setSeconds(0);

            var after = new Date(today);
            after.setHours(23);
            after.setMinutes(59);
            after.setSeconds(59);
            var oc = parsedRrule.between(before, after, true);
            const token = process.env.SLACK_API_TOKEN;
            if (oc.length > 0) {

              if (!occ.slackId) {

                var lec = await LecDao.getById(occ.lectureId);
                this.CreateSlackChannel(occ, token, lec, result);
              } else {
                var slack = await SlackDao.getById(occ.slackId); 
                result.channels.push({ topic: occ.topic, url: "slack://channel?team=" + slack?.teamId + "&id=" + slack?.channelId + "" })

              }

            }
          }
        }

        if (result.channels.length == 0) {
          var slackinf = await SlackDao.getById(1);
          result.channels.push({ topic: "default", url: "slack://channel?team=" + slackinf?.teamId + "&id=" + slackinf?.channelId + "" })
        }

        return result;
      })
      .catch(err => {
        console.log(err);
        return null;
      });


    return res;

  }

  private CreateSlackChannel(occ: any, token: string | undefined, lec: any, result: GetChannelResponse) {
    https.get("https://slack.com/api/conversations.create?name=" + Helper.MakeStringSlackConform(occ.topic) + "&token=" + token, (resp: any) => {
      resp.on('data', async (data: string) => {
        const jsonresp = JSON.parse(data);

        if (jsonresp.ok) {
          var slack = new SlackInfo(jsonresp.channel.shared_team_ids[0], jsonresp.channel.id);
          lec.slackId = await SlackDao.add(slack);
          await LecDao.update(lec);
          result.channels.push({ topic: occ.topic, url: "slack://channel?team=" + slack.teamId + "&id=" + slack.channelId + "" });
        }
        else if (jsonresp.error == "already_taken") {
          // ausdef....
        }
      });
    });
  }

  public async getByObject(occ: IOccupancy): Promise<IOccupancy | null | undefined> {
    const res = await pool<IOccupancy>('occupancy').first()
      .select()
      .where({
        day: occ.day,
        lectureId: occ.lectureId,
        roomId: occ.roomId,
        rrule: occ.rrule,
        end: occ.end.toTimeString(),
        start: occ.start.toTimeString()
      })
      .then(resp => {
        return resp;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    return res;
  }

  /**
   * @param roomId
   */
  public async getByRoom(roomId: number): Promise<IOccupancy[] | null> {
    const res = await pool<IOccupancy>('occupancy')
      .select()
      .where({
        roomId: roomId
      })
      .then(resp => {
        return resp;
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
  public async getAll(): Promise<IOccupancy[] | void> {
    try {
      const res = await pool<IOccupancy>('occupancy')
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
   * @param user
   */
  public async add(occ: IOccupancy): Promise<void> {
    try {
      pool<IOccupancy>('occupancy')
        .insert({
          day: occ.day,
          end: occ.end,
          lectureId: occ.lectureId,
          roomId: occ.roomId,
          start: occ.start,
          rrule: occ.rrule
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
   * @param user
   */
  public async update(occ: IOccupancy): Promise<void> {
    try {
      pool<IOccupancy>('occupancy')
        .where({
          roomId: occ.roomId
        })
        .update({
          day: occ.day,
          end: occ.end,
          lectureId: occ.lectureId,
          start: occ.start,
          rrule: occ.rrule
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
  public async delete(id: number): Promise<void> {
    try {
      pool<IOccupancy>('occupancy')
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
    } catch (error) {
      throw error;
    }
  }
}
