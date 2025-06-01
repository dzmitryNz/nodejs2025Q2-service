import { User } from '../types/user.interface';
import { randomUUID } from 'crypto';

export class UserModel {
  private users: User[] = [];

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

  updatePassword(id: string, oldPassword: string, newPassword: string): User | null | 'forbidden' {
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