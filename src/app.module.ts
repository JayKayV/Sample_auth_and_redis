import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
