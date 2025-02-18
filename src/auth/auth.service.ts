import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || Role.OWNER,
    });

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return this.generateToken(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const { id, emails } = req.user;
    const email = emails[0].value;

    let user = await this.usersService.findOneByGoogleId(id);

    if (!user) {
      user = await this.usersService.findByEmail(email);

      if (user) {
        // Link googleId to existing account
        user = await this.usersService.update(user.id, { googleId: id });
        if (!user) throw new UnauthorizedException('Error linking google account');
      } else {
        user = await this.usersService.create({
          email,
          googleId: id,
          role: Role.OWNER,
          isActive: true,
        });
      }
    }

    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

