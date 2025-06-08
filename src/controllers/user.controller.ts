import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IsString, MinLength } from 'class-validator';

class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(3)
  password: string;
}

class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(3)
  newPassword: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.userService.getById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateUserDto) {
    if (!body.login || !body.password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.create(body.login, body.password);
  }

  @Put(':id')
  updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePasswordDto,
  ) {
    if (!body.oldPassword || !body.newPassword) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = this.userService.updatePassword(
      id,
      body.oldPassword,
      body.newPassword,
    );
    if (result === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (result === 'forbidden') {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = this.userService.delete(id);
    if (!deleted) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }
}
