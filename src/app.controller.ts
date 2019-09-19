import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { AuthUserDto } from './auth/dto/auth-user.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private readonly appService: AppService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() authUser: AuthUserDto) {
    return await this.authService.register(authUser);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
