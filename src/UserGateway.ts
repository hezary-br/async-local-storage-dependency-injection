import { User } from "./entities";
import { userRepositoryVar } from "./instances";

export interface UserGateway {
  getUser(username: string): Promise<User>
  createUser(user: User): Promise<User>
}

export class UserGatewayDatabase implements UserGateway {
  constructor() { }

  async createUser(user: User): Promise<User> {
    await userRepositoryVar.get().create(user)
    return user
  }

  async getUser(username: string): Promise<User> {
    const user = await userRepositoryVar.get().getByUsername(username)
    return user
  }
}