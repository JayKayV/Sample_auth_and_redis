import { Controller, Get, Post, Body, Patch, 
  Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from './entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //@UseInterceptors(ClassSerializerInterceptor)
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) : Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
