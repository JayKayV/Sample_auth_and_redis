import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginResponseDto } from 'src/user/dto/login.response.dto';
import { Redis } from 'ioredis'
import { InjectRedis } from '@nestjs-modules/ioredis';

const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {
  constructor(private usersService: UserService,
              private jwtService: JwtService,
              @InjectRedis() private redis : Redis) {}

  async signIn(username: string, pass: string): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      console.log('Heyo!');
      throw new UnauthorizedException();
    }

    const hasFailed = await this.redis.exists(`Failed#${user.id}`);

    if (hasFailed) {
      console.log('Not Yet!!');
      throw new UnauthorizedException();
    }

    if (!bcrypt.compareSync(pass, user?.password)) {
      const failedLoginTimes = Number.parseInt(await this.redis.get(`${user.id}`)) + 1;

      if (failedLoginTimes == 10) {
        this.redis.setex(`Failed#${user.id}`, 60, 'true');
      }

      this.redis.set(`${user.id}`, failedLoginTimes);
      throw new UnauthorizedException();
    }

    //login success
    this.redis.set(`${user.id}`, 0);
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto : CreateUserDto): Promise<{token}> {
    var user;
    try {
      user = await this.usersService.create(createUserDto);
    } catch (error) {
      throw new Error(JSON.stringify(createUserDto));
    }
    
    const payload = {sub: user.id, username: user.username, role: user.role}
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}