import { Request, Response } from 'express';
import { AsyncVar } from "./AsyncLocalStorage";
import { UserGateway } from "./UserGateway";
import { UserRepository } from "./UserRepository";
import { User } from "./entities";

export class AuthClient {
  async cookie(req: Request, res: Response) {
    const username = req.headers["username"] as string
    return new User(username)
  }
}

class DatabaseClient { }

export const authVar = new AsyncVar<AuthClient>('Auth');
export const dbVar = new AsyncVar<DatabaseClient>('Database');
export const userVar = new AsyncVar<User>('User');
export const userGatewayVar = new AsyncVar<UserGateway>('UserGateway');
export const userRepositoryVar = new AsyncVar<UserRepository>('UserRepository');

