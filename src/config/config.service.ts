import { Injectable, Inject } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: {[key: string]: string};

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
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
    return Boolean(this.envConfig.DATABASE_SYNCHRONIZE);
  }

  getDatabaseDropSchema(): boolean {
    return Boolean(this.envConfig.DATABASE_DROPSCHEMA);
  }
}
