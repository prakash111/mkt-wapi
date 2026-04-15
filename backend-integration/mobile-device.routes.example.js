import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { registerMobileDevice, unregisterMobileDevice } from './mobile-device.controller.example.js';

const router = express.Router();

router.post('/mobile/devices/register', authenticate, registerMobileDevice);
router.post('/mobile/devices/unregister', authenticate, unregisterMobileDevice);

export default router;
