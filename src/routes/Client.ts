import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { RoomDao, LectureDao, SlackInfoDao, OccupancyDao } from '@daos';
import { paramMissingError, logger, adminMW } from '@shared';
import { ILecture, ISlackInfo, IRoom } from '@entities';

// Init shared
const router = Router();
const lecDao = new LectureDao();
const occDao = new OccupancyDao();
const slackDao = new SlackInfoDao();


router.get('/getChannel', async (req: Request, res: Response) => {
    try {
        // Check parameters
        const room = req.query as IRoom;
        var current = await occDao.getByRoomAndTime(room);
        var test =await lecDao.getById(3);
        var slack = await slackDao.getById(1);
        return res.status(OK).json(current);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});



router.post('/createChannel', adminMW, async (req: Request, res: Response) => {
    try {
        // Check parameters
        const { lecture } = req.body;
        if (!lecture) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        // Add new user
        // await roomDao.add(room);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});
export default router;