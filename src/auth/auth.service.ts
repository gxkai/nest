import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import * as crypto from 'crypto-js';
import { User } from '../db/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  key = crypto.enc.Utf8.parse('1234123412ABCDEF');
  iv = crypto.enc.Utf8.parse('ABCDEF1234123412');
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('账号错误');
    }
    if (this.decrypt(user.password) !== pass) {
      throw new UnauthorizedException('密码错误');
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(authUserDto: AuthUserDto) {
    const [username, password] = [
      authUserDto.username,
      this.encrypt(authUserDto.password),
    ];
    const count: number = await this.userRepository.count({ username });
    if (count > 0) {
      throw new UnauthorizedException('用户已存在');
    }
    const user: User = new User();
    user.password = password;
    user.username = username;
    user.roles = 'admin';
    return await this.userRepository.save(user);
  }
  async findUserByToken(token: string) {
    const { username } = Object(this.jwtService.decode(token.split(' ')[1]));
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return user;
  }

  decrypt(word: string): string {
    const encryptedHexStr = crypto.enc.Hex.parse(word);
    const srcs = crypto.enc.Base64.stringify(encryptedHexStr);
    const decrypt = crypto.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    const decryptedStr = decrypt.toString(crypto.enc.Utf8);
    return decryptedStr.toString();
  }

  encrypt(word: string): string {
    const srcs = crypto.enc.Utf8.parse(word);
    const encrypted = crypto.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase();
  }
}
