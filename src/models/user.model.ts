import { randomUUID } from 'crypto';

import { User } from 'src/interfaces/user.interface';

export class UserModel {
  private users: User[] = [
    {
      id: 'd7252305-3626-4836-a550-520638d5f13f',
      login: 'login',
      password: 'passs',
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  ];

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(login: string, password: string): User {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login,
      password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }

  updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): User | null | 'forbidden' {
    const user = this.getById(id);
    if (!user) return null;
    if (user.password !== oldPassword) return 'forbidden';
    user.password = newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return user;
  }

  delete(id: string): boolean {
    const idx = this.users.findIndex((user) => user.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }
}
