import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto, LoginDto, RefreshTokenDto, TokenResponseDto } from '../dto/auth.dto';
import { User } from 'src/models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    return this.userService.create(signupDto.login, hashedPassword);
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.userService.findByLogin(loginDto.login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const user = await this.userService.getById(payload.userId);
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: Omit<User, 'password'>): Promise<TokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId: user.id, login: user.login },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
        },
      ),
      this.jwtService.signAsync(
        { userId: user.id, login: user.login },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
} 