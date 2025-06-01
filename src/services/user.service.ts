import { Injectable } from '@nestjs/common';
import { User } from '../types/user.interface';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  private userModel = new UserModel();

  getAll(): Omit<User, 'password'>[] {
    return this.userModel.getAll().map(({ password, ...rest }) => rest);
  }

  getById(id: string): Omit<User, 'password'> | undefined {
    const user = this.userModel.getById(id);
    if (!user) return undefined;
    // Exclude password
    const { password, ...rest } = user;
    return rest;
  }

  create(login: string, password: string): Omit<User, 'password'> {
    const user = this.userModel.create(login, password);
    const { password: _, ...rest } = user;
    return rest;
  }

  updatePassword(id: string, oldPassword: string, newPassword: string): Omit<User, 'password'> | null | 'forbidden' {
    const result = this.userModel.updatePassword(id, oldPassword, newPassword);
    if (!result || result === 'forbidden') return result;
    const { password, ...rest } = result;
    return rest;
  }

  delete(id: string): boolean {
    return this.userModel.delete(id);
  }
} 