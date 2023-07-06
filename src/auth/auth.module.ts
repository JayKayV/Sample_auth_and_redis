import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RedisModule } from '@nestjs-modules/ioredis'

@Module({
  imports: [UserModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1h' },
  }), RedisModule.forRootAsync({
    useFactory: () => ({
      config: { 
        url: 'redis://localhost:6379',
      },
    }),
  })
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
