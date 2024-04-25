export class User {
  id: string
  constructor(readonly username: string) {
    this.id = Math.random().toString()
  }
}

