import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import { AsyncScope } from './AsyncLocalStorage';
import { UserGatewayDatabase } from './UserGateway';
import { UserRepositoryPrisma } from './UserRepository';
import { User } from './entities';
import { AuthClient, authVar, userGatewayVar, userRepositoryVar, userVar } from './instances';
import { prisma } from './prisma';

const app = express()

const bootstrapMiddleware = () => {
  const auth = new AuthClient();
  const userRepository = new UserRepositoryPrisma(prisma)
  const userGateway = new UserGatewayDatabase()

  return (req: Request, res: Response, next: NextFunction) => {
    new AsyncScope(() => {
      authVar.set(auth);
      userRepositoryVar.set(userRepository)
      userGatewayVar.set(userGateway)
      next();
    });
  };
};

app.use(express.json())
app.use(bootstrapMiddleware())

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = authVar.get();
  const user = await auth.cookie(req, res);
  if (user) {
    userVar.set(user);
    next();
  }
  else {
    res.sendStatus(401);
  }
};

app.post("/user", authMiddleware, async (req, res) => {
  const username = req.body.username
  const user = new User(username)
  const createdUser = await userGatewayVar.get().createUser(user)
  return res.status(207).json(createdUser)
})

app.get("/user/:username", authMiddleware, async (req, res) => {
  const username = req.params["username"]
  const user = await userGatewayVar.get().getUser(username)

  return res.status(202).json(user)
})


app.listen(4000, () => {
  console.log("Server running.")
})