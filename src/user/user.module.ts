import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersProviders } from './entities/user.provider';
import { DatabaseModule } from 'src/database.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...UsersProviders, {
    provide: 'APP_GUARD',
    useClass: AuthGuard
  }],
  exports: [UserService]
})
export class UserModule {}
