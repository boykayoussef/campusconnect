import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import { roles } from '../middleware/roleMiddleware.js';
import { create, mine, status, eventRegistrants, updateStatus, remove } from '../controllers/registrationController.js';

const r = Router();
r.post('/', auth, roles('student'), create);
r.get('/my', auth, roles('student'), mine);
r.get('/status/:eventId', auth, roles('student'), status);
r.get('/event/:id', auth, roles('clubLeader', 'admin'), eventRegistrants);
r.put('/:id', auth, updateStatus);
r.patch('/:id', auth, updateStatus);
r.delete('/:id', auth, remove);

export default r;
