import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const config = this.configService.get('jwt');
    return {
      secret: config.secret,
      signOptions: {
        expiresIn: config.expiresIn,
      }
    };
  }
}
