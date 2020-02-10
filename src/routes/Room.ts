import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { RoomDao } from '@daos';
import { paramMissingError, logger, adminMW } from '@shared';
import RoomHelperClass from '../helper/RoomHelperClass';

// Init shared
const router = Router();
const roomDao = new RoomDao();

/******************************************************************************
 *                                     Export
 ******************************************************************************/

router.get('/all', adminMW, async (req: Request, res: Response) => {
    try {
        const rooms = await roomDao.getAll();
        console.info("test");
        return res.status(OK).json({rooms});
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

router.post('/add', adminMW, async (req: Request, res: Response) => {
    try {
        // Check parameters
        const { room } = req.body;
        if (!room) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        // Add new user
        await roomDao.add(room);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});




router.get('/UpdateRoom', adminMW, async (req: Request, res: Response) => {
    try {
        RoomHelperClass.LoadRoomsHsEsslingen();
        console.info("test");
        res.status(OK);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

router.get('/UpdateRoom2', adminMW, async (req: Request, res: Response) => {
    try {
        RoomHelperClass.LoadIcsHsEsslingen();
        console.info("test");
        res.status(OK);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;
