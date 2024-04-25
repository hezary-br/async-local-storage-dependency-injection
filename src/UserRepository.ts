import { PrismaClient } from "../src/generated/client";
import { User } from "./entities";

export interface UserRepository {
  getByUsername(username: string): Promise<User>
  create(user: User): Promise<void>
}

export class UserRepositoryPrisma implements UserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        username: user.username,
        id: user.id
      }
    })
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { username }
    })

    if (!user) throw new Error("No user found.")

    return new User(user.username)
  }
}