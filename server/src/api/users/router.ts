import express, {Request, Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

import {logger} from '@/server';
import {env} from '@/common/env';

export const usersRouter: Router = (() => {
  const router = express.Router();

  router.get('/users', async (req: Request, res: Response) => {
    logger.info(`VOB request`);

    res.status(StatusCodes.OK).send({});
  });

  router.post('/register', async (req, res) => {
    const {email, password, name, role} = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({error: 'Missing fields'});
    }

    const hashedPassword = await bcrypt.hash(password, env.PASSWORD_SALT);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
      },
    });

    res.status(201).json({message: 'User registered', user});
  });

  router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const token = jwt.sign({id: user.id, role: user.role}, env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.json({token});
  });

  router.post('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({error: 'No token provided'});
    }

    await prisma.session.delete({where: {token}});
    res.json({message: 'Logged out'});
  });


  return router;
})();
