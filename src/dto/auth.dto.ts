import { IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(3)
  password: string;
}

export class LoginDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(3)
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
} 