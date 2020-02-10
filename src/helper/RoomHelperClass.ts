import { http } from "winston";
import { stringify } from 'querystring';
import { isNumber, isDate, isArray } from 'util';
import { CalendarComponent, FullCalendar } from 'ical';
import {  RoomDao, LectureDao, SlackInfoDao, OccupancyDao } from '@daos';
import { Room, Occupancy, Lecture, IRoom, SlackInfo, ILecture } from '@entities';
import Helper from './HelperClass';


const roomDao = new RoomDao();
const lecDao = new LectureDao();
const slackDao = new SlackInfoDao();
const occDao = new OccupancyDao();
const https = require('https');
const ical = require('node-ical');




class RoomHelperClass {
    static async LoadIcsHsEsslingen() {

        var occList: Array<Occupancy> = [];
        var lecList: Array<Lecture> = [];
        var roomlist: Array<Room> = [];

        for (let index = 0; index < RoomHelperClass.terminlist.length; index = index + 300) {
            let tlist: string = "";
            for (let i2 = index; (i2 < index + 300) && index < RoomHelperClass.terminlist.length; i2++) {
                if (RoomHelperClass.terminlist[i2] !== undefined) {
                    tlist += RoomHelperClass.terminlist[i2] + ",";
                }
            }

            let url = "https://www3.hs-esslingen.de/qislsf/rds?state=verpublish&status=transform&vmfile=no&termine=" + tlist.substring(0, tlist.length - 1) + "&moduleCall=iCalendarPlan&publishConfFile=reports&publishSubDir=veranstaltung";

            const webEvents: FullCalendar = await ical.async.fromURL(url);
            console.log(webEvents);


            if (webEvents) {
                for (const key in webEvents) {
                    var el = webEvents[key];
                    if (el.type == "VEVENT") {
                        //Gebäude 01 - F 01.311
                        var location = el.location?.substring(13, 14)
                        var buildingNr = el.location?.substring(15, 17);
                        var roomNr = el.location?.substring(18);

                        var room = roomlist.find(x => x.buildingNr === buildingNr && x.roomNr === roomNr);
                        if (!room) {
                            room = new Room(buildingNr, roomNr);
                            // room.location = location
                            roomlist.push(room);
                        }

                        if (!el.uid) {
                            continue;
                        }

                        var lec = lecList.find(x => x.topic == el.summary);
                        if (!lec) {
                            lec = new Lecture(0, el.summary, 1, undefined);
                            lecList.push(lec);
                        }

                        var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

                        if (!isDate(el.start)) {
                            continue;
                        }

                        var day = days[el.start.getDay()];

                        var newocc = new Occupancy(roomlist.findIndex(x => x == room), lecList.findIndex(x => x.topic == el.summary), el.start, el.end, day, el.rrule?.toString());

                        var occ = occList.find(x => x == newocc);
                        // var occ = occList.find(x => x.day == newocc.day && newocc.end == newocc.end && x.lectureId == newocc.lectureId &&   occ.rrule == newocc.rrule)
                        if (!occ) {
                            occList.push(newocc);
                        }


                    }

                }

            }
        }

        for (const room of roomlist) {
            var existroom = await roomDao.getByBuildingAndRoom(room.buildingNr, room.roomNr);
            if (!existroom) {
                await roomDao.add(room);
            }
        }

        for (const lec of lecList) {
            var lecr = await lecDao.getByTopic(lec.topic);
            if (!lecr) {
                await lecDao.add(lec);
            }
        }

        const token = process.env.SLACK_API_TOKEN;

        for (const occ of occList) {

            var databaseroom = (await roomDao.getByBuildingAndRoom(roomlist[occ.roomId].buildingNr, roomlist[occ.roomId].roomNr));
            if (databaseroom) {
                occ.roomId = databaseroom.id || 0;
            }

            var lecturedatabase: Lecture | null| undefined = (await lecDao.getByTopic(lecList[occ.lectureId].topic));
            if (lecturedatabase) {
                occ.lectureId = lecturedatabase.id || 0;

            

                var existocc = await occDao.getByObject(occ);    
            // Update SlackChannels
            https.get("https://slack.com/api/conversations.list?limit=10000&token=" + token, async (resp: any) => {
                var store = "";
                var lecs : any = await lecDao.getAll();
                if (!isArray(lecs)) {
                    return;
                }
                resp.on('data', (data: string) => {
                    store += data;
                });

                resp.on('end', async (iwas: any) => {

                    const jsonresp = JSON.parse(store);
                    if (jsonresp.ok) {
                        for (let lec of lecs) {
                            var isCreated = false;
                            for (let channel of jsonresp.channels) {
                                if (channel.name == Helper.MakeStringSlackConform(lec.topic)) {
                                    isCreated = true;
                                    var slack = new SlackInfo(channel.shared_team_ids[0], channel.id)
                                    var slackold = await slackDao.getById(lec.slackID);
                                    if (slackold && slack.channelId != slackold.channelId && slack.teamId != slackold.teamId) {
                                        lec.slackID = await slackDao.add(slack);
                                        await lecDao.update(lec);
                                    }
                                }
                            }

                            // if (!isCreated) {
                            //     https.get("https://slack.com/api/conversations.create?name=" + RoomHelperClass.MakeStringSlackConform(lec.topic) + "&token=" + token, (resp: any) => {
                            //         resp.on('data', async (data: string) => {
                            //             const jsonresp = JSON.parse(data);
                            //             if (jsonresp.ok) {
                            //                 var slack = new SlackInfo(jsonresp.channel.shared_team_ids[0], jsonresp.channel.id)
                            //                 lecturedatabase.slackID = await slackDao.add(slack);
                            //                 await lecDao.update(lecturedatabase)
                            //             }
                            //         });
                            //     });
                            // }
                        }
                    }
                });
            });

            }


            if (!existocc) {
                await occDao.add(occ);
            }
        }



    }

    static terminlist: Array<number> = [];
    static LoadIcsFileStr(rgid: string) {
        https.get("https://www3.hs-esslingen.de/qislsf/rds?state=wplan&raum.rgid=" + rgid + "&week=-2&act=Raum&pool=Raum&show=plan&P.vx=lang&fil=plu&P.subc=plan", (resp: any) => { RoomHelperClass.IcsSiteLoaded(resp) }); // HS-Esslingen Spezifisch
    }

    static LoadRoomsHsEsslingen(): void {
        https.get("https://www3.hs-esslingen.de/qislsf/rds?state=wplan&act=Raum&pool=Raum&show=plan&P.subc=plan", (resp: any) => { this.SiteLoaded(resp) })
    }

    static startedRequest: number = 0;
    static initstartedRequest: number = 0;
    static IcsSiteLoaded(resp: any): any {
        // nicht entgültig (<a href="https:\/\/www3\.hs-esslingen\.de\/qislsf\/rds\?state=verpublish&amp;status=transform&amp;vmfile=no&amp;termine=)(.*)(&amp;moduleCall=iCalendarPlan&amp;publishConfFile=reports&amp;publishSubDir=veranstaltung" hreflang="de" charset="ISO-8859-1" class="tree">)
        const regex = /(termine=)(.*)(&)/gm;
        this.initstartedRequest--;
        let m: RegExpExecArray | null;
        RoomHelperClass.startedRequest++;
        const str = resp.on('data', (d: any) => {
            while ((m = regex.exec(d.toString())) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                for (const group in m) {
                    if (group === "2") {
                        for (const match of m[group].split(',')) {
                            var parse = parseInt(match);
                            if (isNumber(parse)) {
                                console.log(`Found match, group ${group}: ${match}`);
                                if (!RoomHelperClass.terminlist.includes(parse)) {
                                    RoomHelperClass.terminlist.push(parse);
                                }
                            }
                        }
                    }
                }

                RoomHelperClass.startedRequest--;

                if (RoomHelperClass.startedRequest === 0 && RoomHelperClass.initstartedRequest === 0) {
                    RoomHelperClass.LoadIcsHsEsslingen();
                }
            }
        });
    }

    static SiteLoaded(resp: any): any {
        const regex = /(raum.rgid=([0-9]*))/gm;

        const str = resp.on('data', (d: any) => {

            let m: RegExpExecArray | null;

            while ((m = regex.exec(d.toString())) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                for (const group in m) {

                    if (group === "2") {
                        this.initstartedRequest++;
                        console.log(`Found match, group ${group}: ${m[group]}`);
                        RoomHelperClass.LoadIcsFileStr(m[group]);
                        
                    }
                }

            }
        });
    }
}


export default RoomHelperClass;