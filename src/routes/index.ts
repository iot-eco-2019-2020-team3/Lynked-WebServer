import { Router } from 'express';
import UserRouter from './Users';
import ClientRouter from './Client';
import AuthRouter from './Auth';
import RoomRouter from './Room';
import OrganizationRouter from './Organization';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/client', ClientRouter);
router.use('/rooms', RoomRouter);
router.use('/auth', AuthRouter);
router.use('/organization', OrganizationRouter);

// Export the base-router
export default router;
