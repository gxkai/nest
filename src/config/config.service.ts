import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(
      fs.readFileSync(`env/${process.env.NODE_ENV || 'development'}.env`),
    );
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getDatabaseHost(): string {
    return this.envConfig.DATABASE_HOST;
  }

  getDatabasePort(): number {
    return Number(this.envConfig.DATABASE_PORT);
  }

  getDatabaseUser(): string {
    return this.envConfig.DATABASE_USER;
  }

  getDatabasePWD(): string {
    return this.envConfig.DATABASE_PWD;
  }

  getDatabaseDB(): string {
    return this.envConfig.DATABASE_DB;
  }

  getDatabaseSychronize(): boolean {
    return this.envConfig.DATABASE_SYNCHRONIZE === 'true';
  }

  getDatabaseDropSchema(): boolean {
    return this.envConfig.DATABASE_DROPSCHEMA === 'true';
  }
  getJwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }
}
