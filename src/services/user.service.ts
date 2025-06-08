import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async getById(id: string): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return undefined;

    return user;
  }

  async create(
    login: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = this.userRepository.create({
      login,
      password,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    delete savedUser.password;

    return savedUser;
  }

  async updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<Omit<User, 'password'> | null | 'forbidden'> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    if (user.password !== oldPassword) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.save(user);

    delete updatedUser.password;

    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
