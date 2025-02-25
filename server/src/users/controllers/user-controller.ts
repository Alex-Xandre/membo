import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user-model';
import Activation from '../models/activation-model';
import Session from '../models/session-model';
import { sendRegistration } from '../../helpers/sendMail';
import { activationToken, generateToken } from '../../middlewares/jwt-functions';
import { CustomRequest } from '../../types';

//register and update
export const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const data = req.body;
    if (!mongoose.isValidObjectId(data._id)) {
      const { email, password, userId } = data;

      if (!email || !password || !userId) {
        res.status(400);
        throw new Error('Please Fill all the Fields');
      }

      const isUserEmail = await User.findOne({ email });
      const isUsername = await User.findOne({ userId });

      if (isUsername || isUserEmail) {
        res.status(400);
        throw new Error('User already exists');
      }

      const isPending = await Activation.findOne({ email });

      if (isPending) {
        res.status(400);
        throw new Error('Email already has a pending registration');
      }

      const generateActivationCode = (): string => {
        return (Math.floor(Math.random() * 9000) + 1000).toString();
      };

      const activationCode = generateActivationCode();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const hashedCode = await bcrypt.hash(activationCode, salt);

      const userData = {
        ...data,
        password: hashedPassword,
        code: hashedCode,
      };

      const activation_token = activationToken(userData);
      const url = `http://localhost:5173/activate/?token=${activation_token}`;
      const name = userId;

      const expiryTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

      await Activation.create({ email, code: hashedCode, expiry: expiryTime });
      sendRegistration(email, password, name, url, activationCode);
      res.status(200).json({ msg: 'Please check your email for verification', link: activation_token });
    } else {
      const newUser = await User.findByIdAndUpdate(data._id, { ...data, userId: data.userName }, { new: true });
      res.status(200).json({ msg: 'User Updated  Succesfully', newUser });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// activate acc
export const activate = expressAsyncHandler(async (req, res) => {
  try {
    const { activation_token, code } = req.body;

    const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);

    console.log(user);
    if (!user) {
      res.status(400);
      throw new Error('Invalid Token');
    }
    const isActivate = await Activation.findOne({ email: user.email });
    if (!isActivate) {
      res.status(400);
      throw new Error('Activation record not found');
    }

    console.log(code, isActivate.code);
    const isValidCode = isActivate && (await bcrypt.compare(code, isActivate.code));
    const currentTime = new Date();
    const expiryTime = new Date(isActivate.expiry);

    if (!isValidCode || currentTime > expiryTime) {
      res.status(400);
      throw new Error('Invalid or expired code. Please try again');
    }

    delete user._id;
    const newUser = await User.create(user);

    if (newUser) {
      await Activation.deleteOne({ email: user.email });

      res.status(200).json(newUser);
    } else {
      res.status(500);
      throw new Error('Failed to create user');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

//login user
export const loginUser = expressAsyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const { userId, password } = data;

    if (!userId || !password) {
      res.status(400);
      throw new Error('Please fill all the fields');
    }

    const user = await User.findOne({ userId });
    if (!user) res.status(400).json({ msg: 'User not Found' });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Invalidate all previous sessions for this user
      await Session.deleteMany({ user: user._id });

      // Generate a new token and session for this login
      const token = generateToken(String(user._id));

      const session = new Session({
        user: user._id,
        sessionToken: token,
      });
      await session.save();

      res.status(200).json({
        role: user.role,
        _id: user._id,
        token,
        tenantId: user?.tenantUserId?.tenantId,
      });
    } else {
      res.status(500).json({ msg: 'Invalid Email or Password' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//validate session
export const validateSession = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ msg: 'No token provided' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const session = await Session.findOne({
      user: decoded.id,
      sessionToken: token,
    });

    if (!session) {
      res.status(401).json({ msg: 'Session expired. Please log in again.' });
    }

    // If the session is valid
    res.status(200).json({ msg: 'Session is valid' });
  } catch (error: any) {
    res.status(401).json({ msg: error.message || 'Invalid token' });
  }
});

//logout
export const logoutUser = expressAsyncHandler(async (req: any, res) => {
  try {
    // Delete the session from the database (invalidate it)
    await Session.deleteOne({
      user: req.user._id,
      sessionToken: req.headers.authorization.split(' ')[1],
    });

    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getUser = expressAsyncHandler(async (req: CustomRequest, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
});

export const getAllUsers = async (req: CustomRequest, res) => {
  const allUser = await User.find({}).sort({ createdAt: -1 });
  const filterUser = allUser
    .filter((x) => (x as any)._id.toString() !== req.user._id)
    ?.filter((x) => (req.user.role === 'tenant' ? x.tenantUserId.tenantId === req.user._id.toString() : x));
  res.status(200).json(filterUser);
};

//register
export const registerUserByAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const data = req.body;

    console.log(data);
    if (!mongoose.isValidObjectId(data._id)) {
      const { email, userId } = data;

      if (!email || !userId) {
        res.status(400);
        throw new Error('Please Fill all the Fields');
      }

      const isUserEmail = await User.findOne({ email });
      const isUsername = await User.findOne({ userId });

      if (isUsername || isUserEmail) {
        res.status(400);
        throw new Error('User already existss');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      delete data._id;
      const newUser = await User.create({ ...data, password: hashedPassword, userId });

      res.status(200).json({ msg: 'User Added Succesfully', newUser });
    } else {
      const updateuser = await User.findByIdAndUpdate(data._id, data, { new: true });
      res.status(200).json(updateuser);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
});
