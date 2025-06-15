import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
} 