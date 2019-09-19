import { IsString } from 'class-validator';

export class AuthUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
