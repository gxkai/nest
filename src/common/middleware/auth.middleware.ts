import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    const token: string = req.headers.authorization;
    if (token) {
      req.user = await this.authService.findUserByToken(req.headers.authorization);
    } else {
      throw new UnauthorizedException('请求头不包含token');
    }
    next();
  }
}
