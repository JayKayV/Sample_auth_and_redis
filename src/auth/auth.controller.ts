import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Request, HttpException, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiHeader, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BadRequestDto } from 'src/user/dto/bad.request.dto';
import { LoginResponseDto } from 'src/user/dto/login.response.dto';
import { UnauthorizedReponseDto } from 'src/user/dto/unauthorized.dto';
//import { ClientProxy } from '@nestjs/microservices';


@Controller('auth')
export class AuthController {
  constructor(private authService : AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'User successfully logged in'})
  @ApiBadRequestResponse({
    type: BadRequestDto,
    description: 'Either username or password is in wrong format'})
  @ApiUnauthorizedResponse({
    type: UnauthorizedReponseDto,
    description: 'User failed to login (maybe it doesn\'t exist in the records?)'
  })
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: LoginDto) {
    console.log(signInDto);
    try {
      return this.authService.signIn(signInDto.username, signInDto.password); 
    } catch (error) {
      throw new HttpException('User can\'t be logged in', HttpStatus.UNAUTHORIZED, {cause: error});
    }
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    try {
        return this.authService.signUp(signUpDto);
    } catch (error) {
      throw new HttpException( {
          status: HttpStatus.BAD_REQUEST,
          error: 'Something wrong happened'
      }, HttpStatus.BAD_REQUEST, {cause: error});
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiHeader({name: 'Authorization', description: 'Header for authentication process'})
  getProfile(@Request() req) {
    return req.user;
  }
}
