import { Injectable } from '@nestjs/common';
import { User } from '../types/user.interface';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  private userModel = new UserModel();

  getAll(): Omit<User, 'password'>[] {
    return this.userModel.getAll().map((user) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  getById(id: string): Omit<User, 'password'> | undefined {
    const user = this.userModel.getById(id);
    if (!user) return undefined;

    delete user.password;

    return user;
  }

  create(login: string, password: string): Omit<User, 'password'> {
    const user = this.userModel.create(login, password);

    delete user.password;

    return user;
  }

  updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Omit<User, 'password'> | null | 'forbidden' {
    const result = this.userModel.updatePassword(id, oldPassword, newPassword);
    if (!result || result === 'forbidden') return result;

    delete result.password;

    return result;
  }

  delete(id: string): boolean {
    return this.userModel.delete(id);
  }
}
