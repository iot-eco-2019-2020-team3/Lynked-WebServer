import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { OrganizationDao } from '@daos';
import { paramMissingError, logger, adminMW } from '@shared';

// Init shared
const router = Router();
const organizationDao = new OrganizationDao();

/******************************************************************************
 *                                     Export
 ******************************************************************************/

router.get('/all', adminMW, async (req: Request, res: Response) => {
    try {
        const organizations = await organizationDao.getAll();
        console.info("test");
        return res.status(OK).json({organizations});
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
        const { organization } = req.body;
        if (!organization) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        // Add new user
        await organizationDao.add(organization);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


export default router;
