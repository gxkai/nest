import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    console.log(`Request...`);
    next();
  }
}
