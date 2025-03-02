import express from 'express';
import {
  activate,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  registerUserByAdmin,
  validateSession,
  getRoute,
} from '../controllers/user-controller';
import protect from '../../middlewares/auth-protect';

const router = express.Router();
router.post('/add-user', protect, registerUserByAdmin);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/logout', logoutUser);
router.post('/activate', activate);
router.get('/user', protect, getUser);
router.get('/all-user', protect, getAllUsers);
router.get('/base-url/:id', getRoute);

router.get('/validate-session', validateSession);

export default router;
